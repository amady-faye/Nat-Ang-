from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.models import User, Document, ReadingProgress, ClasseCode, UserRole
from app.api.auth import get_current_user

router = APIRouter()

# Schémas
class StudentProgress(BaseModel):
    user_id: int
    nom: str
    prenom: str
    email: str
    documents_lus: int
    temps_total: int
    derniere_activite: datetime

@router.get("/students")
async def get_students(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Vérifier que c'est un formateur
    if current_user.role != UserRole.FORMATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux formateurs"
        )
    
    # Récupérer tous les apprenants
    students = db.query(User).filter(User.role == UserRole.APPRENANT).all()
    
    students_data = []
    for student in students:
        # Calculer les statistiques
        progress_entries = db.query(ReadingProgress).filter(
            ReadingProgress.user_id == student.id
        ).all()
        
        docs_completed = sum(1 for p in progress_entries if p.pourcentage_complete == 100)
        total_time = sum(p.temps_lecture for p in progress_entries)
        last_activity = max([p.derniere_lecture for p in progress_entries]) if progress_entries else None
        
        students_data.append({
            "user_id": student.id,
            "nom": student.nom,
            "prenom": student.prenom,
            "email": student.email,
            "code_classe": student.code_classe,
            "documents_lus": docs_completed,
            "temps_total": total_time,
            "derniere_activite": last_activity
        })
    
    return students_data

@router.get("/classes")
async def get_classes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.FORMATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux formateurs"
        )
    
    classes = db.query(ClasseCode).filter(
        ClasseCode.created_by == current_user.id
    ).all()
    
    classes_data = []
    for classe in classes:
        # Compter les élèves
        student_count = db.query(User).filter(
            User.code_classe == classe.code,
            User.role == UserRole.APPRENANT
        ).count()
        
        classes_data.append({
            "id": classe.id,
            "code": classe.code,
            "nom_classe": classe.nom_classe,
            "specialite": classe.specialite,
            "nombre_eleves": student_count,
            "is_active": classe.is_active,
            "created_at": classe.created_at
        })
    
    return classes_data

@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.FORMATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux formateurs"
        )
    
    # Statistiques globales
    total_students = db.query(User).filter(User.role == UserRole.APPRENANT).count()
    total_documents = db.query(Document).filter(Document.uploaded_by == current_user.id).count()
    
    # Activité récente (7 derniers jours)
    week_ago = datetime.utcnow() - timedelta(days=7)
    active_students = db.query(ReadingProgress).filter(
        ReadingProgress.derniere_lecture >= week_ago
    ).distinct(ReadingProgress.user_id).count()
    
    # Temps total de lecture
    total_reading_time = db.query(func.sum(ReadingProgress.temps_lecture)).scalar() or 0
    
    return {
        "total_eleves": total_students,
        "total_documents": total_documents,
        "eleves_actifs_semaine": active_students,
        "temps_lecture_total": total_reading_time
    }

@router.get("/student/{student_id}/progress")
async def get_student_progress(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.FORMATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux formateurs"
        )
    
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Élève non trouvé"
        )
    
    progress_entries = db.query(ReadingProgress, Document).join(
        Document, ReadingProgress.document_id == Document.id
    ).filter(ReadingProgress.user_id == student_id).all()
    
    progress_data = []
    for progress, document in progress_entries:
        progress_data.append({
            "document_id": document.id,
            "titre": document.titre,
            "categorie": document.categorie,
            "pourcentage_complete": progress.pourcentage_complete,
            "temps_lecture": progress.temps_lecture,
            "derniere_lecture": progress.derniere_lecture
        })
    
    return {
        "student": {
            "id": student.id,
            "nom": student.nom,
            "prenom": student.prenom,
            "email": student.email
        },
        "progress": progress_data
    }
