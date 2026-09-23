from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from googletrans import Translator
import os
import json

from database import get_db
from models import User, Document, ReadingProgress
from auth import get_current_user

router = APIRouter()
translator = Translator()

# Schémas
class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "fr"

class ExplanationRequest(BaseModel):
    text: str
    context: Optional[str] = None
    type: str = "grammar"  # grammar, vocabulary, pronunciation

class ProgressUpdate(BaseModel):
    document_id: int
    paragraphe_actuel: int
    pourcentage_complete: int
    temps_lecture: int

@router.post("/translate")
async def translate_text(
    request: TranslationRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        translation = translator.translate(
            request.text,
            src=request.source_lang,
            dest=request.target_lang
        )
        
        return {
            "original": request.text,
            "translated": translation.text,
            "source_lang": request.source_lang,
            "target_lang": request.target_lang
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur de traduction: {str(e)}"
        )

@router.post("/explain")
async def explain_with_ai(
    request: ExplanationRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint pour obtenir des explications via Claude AI
    Note: Nécessite une clé API Claude (à configurer plus tard)
    Pour l'instant, retourne une réponse mockée
    """
    
    # TODO: Intégrer l'API Claude quand la clé sera disponible
    # Pour l'instant, on retourne une réponse exemple
    
    if request.type == "grammar":
        explanation = f"Analyse grammaticale de : '{request.text}'\n\n"
        explanation += "Structure : Sujet + Verbe + Complément\n"
        explanation += "Temps verbal utilisé : Present Simple\n"
        explanation += "Cette structure est utilisée pour exprimer des faits généraux."
    elif request.type == "vocabulary":
        explanation = f"Vocabulaire : '{request.text}'\n\n"
        explanation += "Ce terme est couramment utilisé dans le contexte technique.\n"
        explanation += "Synonymes possibles : ...\n"
        explanation += "Exemples d'utilisation : ..."
    else:
        explanation = f"Explication pour : '{request.text}'"
    
    return {
        "text": request.text,
        "type": request.type,
        "explanation": explanation,
        "note": "Cette fonctionnalité sera améliorée avec l'API Claude"
    }

@router.post("/progress")
async def update_progress(
    progress: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Vérifier que le document existe
    document = db.query(Document).filter(Document.id == progress.document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document non trouvé"
        )
    
    # Chercher ou créer la progression
    existing_progress = db.query(ReadingProgress).filter(
        ReadingProgress.user_id == current_user.id,
        ReadingProgress.document_id == progress.document_id
    ).first()
    
    if existing_progress:
        existing_progress.paragraphe_actuel = progress.paragraphe_actuel
        existing_progress.pourcentage_complete = progress.pourcentage_complete
        existing_progress.temps_lecture = progress.temps_lecture
    else:
        new_progress = ReadingProgress(
            user_id=current_user.id,
            document_id=progress.document_id,
            paragraphe_actuel=progress.paragraphe_actuel,
            pourcentage_complete=progress.pourcentage_complete,
            temps_lecture=progress.temps_lecture
        )
        db.add(new_progress)
    
    db.commit()
    
    return {"message": "Progression enregistrée avec succès"}

@router.get("/progress/{document_id}")
async def get_progress(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(ReadingProgress).filter(
        ReadingProgress.user_id == current_user.id,
        ReadingProgress.document_id == document_id
    ).first()
    
    if not progress:
        return {
            "document_id": document_id,
            "paragraphe_actuel": 0,
            "pourcentage_complete": 0,
            "temps_lecture": 0
        }
    
    return {
        "document_id": document_id,
        "paragraphe_actuel": progress.paragraphe_actuel,
        "pourcentage_complete": progress.pourcentage_complete,
        "temps_lecture": progress.temps_lecture,
        "derniere_lecture": progress.derniere_lecture
    }
