from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import PyPDF2
import io

from app.core.database import get_db
from app.models.models import User, Document, UserRole
from app.api.auth import get_current_user

router = APIRouter()

# Schémas
class DocumentCreate(BaseModel):
    titre: str
    categorie: str
    contenu: str
    is_public: bool = True

class DocumentResponse(BaseModel):
    id: int
    titre: str
    categorie: str
    contenu: str
    uploaded_by: int
    is_public: bool
    
    class Config:
        from_attributes = True

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    document: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Seuls les formateurs peuvent uploader
    if current_user.role != UserRole.FORMATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les formateurs peuvent uploader des documents"
        )
    
    new_doc = Document(
        titre=document.titre,
        categorie=document.categorie,
        contenu=document.contenu,
        uploaded_by=current_user.id,
        is_public=document.is_public
    )
    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    return new_doc

@router.post("/upload-pdf")
async def upload_pdf(
    titre: str,
    categorie: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Seuls les formateurs peuvent uploader
    if current_user.role != UserRole.FORMATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les formateurs peuvent uploader des documents"
        )
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seuls les fichiers PDF sont acceptés"
        )
    
    # Lire le PDF
    try:
        pdf_content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        
        # Extraire le texte de toutes les pages
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n\n"
        
        if not text_content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Impossible d'extraire le texte du PDF"
            )
        
        # Créer le document
        new_doc = Document(
            titre=titre,
            categorie=categorie,
            contenu=text_content,
            fichier_original=file.filename,
            uploaded_by=current_user.id,
            is_public=True
        )
        
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        
        return {
            "message": "PDF uploadé avec succès",
            "document_id": new_doc.id,
            "titre": new_doc.titre
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du traitement du PDF: {str(e)}"
        )

@router.get("/list", response_model=List[DocumentResponse])
async def list_documents(
    categorie: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Document).filter(Document.is_public == True)
    
    if categorie:
        query = query.filter(Document.categorie == categorie)
    
    documents = query.order_by(Document.created_at.desc()).all()
    return documents

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document non trouvé"
        )
    
    if not document.is_public and document.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas accès à ce document"
        )
    
    return document

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document non trouvé"
        )
    
    # Seul le formateur qui a uploadé ou un admin peut supprimer
    if current_user.role != UserRole.FORMATEUR or document.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez pas supprimer ce document"
        )
    
    db.delete(document)
    db.commit()
    
    return {"message": "Document supprimé avec succès"}
