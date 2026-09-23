from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from database import get_db
from security import verify_password, get_password_hash, create_access_token, decode_token
from models import User, UserRole, ClasseCode

router = APIRouter()
security = HTTPBearer()

# Schémas Pydantic
class UserRegister(BaseModel):
    email: EmailStr
    nom: str
    prenom: str
    password: str
    code_classe: str  # Code d'inscription fourni par le formateur

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class CreateClasseCode(BaseModel):
    code: str
    nom_classe: str
    specialite: str

# Dépendance pour obtenir l'utilisateur actuel
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur non trouvé"
        )
    
    return user

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Vérifier si l'email existe déjà
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est déjà utilisé"
        )
    
    # Vérifier le code de classe
    classe_code = db.query(ClasseCode).filter(
        ClasseCode.code == user_data.code_classe,
        ClasseCode.is_active == True
    ).first()
    
    if not classe_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code de classe invalide"
        )
    
    # Créer le nouvel utilisateur
    new_user = User(
        email=user_data.email,
        nom=user_data.nom,
        prenom=user_data.prenom,
        hashed_password=get_password_hash(user_data.password),
        role=UserRole.APPRENANT,
        code_classe=user_data.code_classe
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Créer le token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "nom": new_user.nom,
            "prenom": new_user.prenom,
            "role": new_user.role
        }
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # Trouver l'utilisateur
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte désactivé"
        )
    
    # Créer le token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "nom": user.nom,
            "prenom": user.prenom,
            "role": user.role
        }
    }

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "nom": current_user.nom,
        "prenom": current_user.prenom,
        "role": current_user.role,
        "code_classe": current_user.code_classe
    }

# Routes admin pour les formateurs
@router.post("/create-classe-code")
async def create_classe_code(
    data: CreateClasseCode,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Vérifier que c'est un formateur
    if current_user.role != UserRole.FORMATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les formateurs peuvent créer des codes de classe"
        )
    
    # Vérifier si le code existe déjà
    existing_code = db.query(ClasseCode).filter(ClasseCode.code == data.code).first()
    if existing_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce code existe déjà"
        )
    
    # Créer le code de classe
    new_code = ClasseCode(
        code=data.code,
        nom_classe=data.nom_classe,
        specialite=data.specialite,
        created_by=current_user.id
    )
    
    db.add(new_code)
    db.commit()
    db.refresh(new_code)
    
    return {
        "message": "Code de classe créé avec succès",
        "code": new_code.code,
        "nom_classe": new_code.nom_classe
    }
