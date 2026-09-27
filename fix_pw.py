import os

os.environ["DATABASE_URL"] = "postgresql://neondb_owner:npg_v1zAldnc6Pap@ep-spring-bird-b21iy946-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

from database import SessionLocal
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    session = SessionLocal()
    user = session.query(User).filter(User.email == "formateur@cfa.fr").first()
    if user:
        user.hashed_password = pwd_context.hash("password123")
        session.commit()
        print("Password updated using passlib!")
    else:
        print("User not found!")
    session.close()

if __name__ == "__main__":
    main()
