from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class UserRole(str, enum.Enum):
    FORMATEUR = "formateur"
    APPRENANT = "apprenant"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    code_classe = Column(String, nullable=True)  # Pour les apprenants
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    documents_uploaded = relationship("Document", back_populates="uploader", foreign_keys="Document.uploaded_by")
    progress = relationship("ReadingProgress", back_populates="user")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    categorie = Column(String, nullable=False)  # logistique, transport, mécanique
    contenu = Column(Text, nullable=False)  # Texte extrait du document
    fichier_original = Column(String, nullable=True)  # Chemin du fichier original
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_public = Column(Boolean, default=True)  # Visible par tous les apprenants
    
    # Relations
    uploader = relationship("User", back_populates="documents_uploaded")
    progress_entries = relationship("ReadingProgress", back_populates="document")

class ReadingProgress(Base):
    __tablename__ = "reading_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    paragraphe_actuel = Column(Integer, default=0)
    pourcentage_complete = Column(Integer, default=0)
    temps_lecture = Column(Integer, default=0)  # En secondes
    derniere_lecture = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="progress")
    document = relationship("Document", back_populates="progress_entries")

class ClasseCode(Base):
    __tablename__ = "classe_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    nom_classe = Column(String, nullable=False)
    specialite = Column(String, nullable=False)  # logistique, transport, mécanique
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
