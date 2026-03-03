"""
Script d'initialisation de la base de données NAT_ANG
Crée un compte formateur et les documents d'exemple
"""

import sys
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nat_ang.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def create_formateur():
    """Crée un compte formateur"""
    print("\n🎓 Création d'un compte formateur")
    print("=" * 50)
    
    email = input("Email du formateur : ").strip()
    nom = input("Nom : ").strip()
    prenom = input("Prénom : ").strip()
    password = input("Mot de passe : ").strip()
    
    if not all([email, nom, prenom, password]):
        print("❌ Tous les champs sont requis !")
        sys.exit(1)
    
    hashed_password = pwd_context.hash(password)
    
    return {
        "email": email,
        "nom": nom,
        "prenom": prenom,
        "hashed_password": hashed_password
    }

def insert_sample_documents():
    """Retourne les documents d'exemple"""
    return [
        {
            "titre": "Warehouse Safety Procedures",
            "categorie": "logistique",
            "contenu": """Warehouse safety is a critical aspect of logistics operations that requires constant attention and adherence to established protocols. Every worker must understand and follow basic safety guidelines to prevent accidents and ensure a secure working environment.

The first fundamental rule concerns personal protective equipment, commonly known as PPE. All warehouse personnel must wear appropriate safety gear at all times. This includes steel-toed boots to protect feet from falling objects, high-visibility vests to ensure workers are easily seen by forklift operators, and hard hats in designated areas where overhead hazards exist.

Material handling equipment operation requires special certification and training. Forklift operators must possess valid licenses and undergo regular refresher courses. When operating a forklift, drivers must observe strict speed limits within the warehouse, typically no more than 5 miles per hour in congested areas. They must sound their horns when approaching blind corners and intersections to alert pedestrians and other operators.

Loading dock procedures demand particular attention to detail. Before loading or unloading a truck, workers must ensure that the vehicle is properly positioned and secured. Wheel chocks must be placed behind the rear wheels to prevent the truck from rolling away. The dock plate or leveler must be checked for stability before equipment crosses it. Never begin loading operations until the truck driver has shut off the engine and remained outside the vehicle.

Proper stacking and storage techniques prevent merchandise damage and worker injuries. Heavy items should always be stored on lower shelves, while lighter products can occupy higher positions. Stack pallets no more than six feet high unless using proper racking systems. Leave adequate aisle space between stacks to allow for equipment movement and emergency evacuation if necessary.

Emergency preparedness is essential for all warehouse employees. Know the location of fire extinguishers, emergency exits, and first aid stations. Regular fire drills help ensure everyone can evacuate quickly and safely. Report all accidents, injuries, and near-miss incidents immediately to supervisors, regardless of severity. This information helps identify hazards and implement preventive measures."""
        },
        {
            "titre": "Understanding Hours of Service Regulations for Truck Drivers",
            "categorie": "transport",
            "contenu": """Commercial truck drivers must comply with Hours of Service regulations designed to prevent fatigue-related accidents and ensure road safety. These federal regulations establish strict limits on driving time and require mandatory rest periods.

The basic rule states that drivers may drive a maximum of 11 hours after 10 consecutive hours off duty. This 11-hour driving window must occur within a 14-hour period after coming on duty. Once a driver reaches either the 11-hour driving limit or the 14-hour on-duty limit, they must take a 10-hour break before driving again. It is crucial to understand that the 14-hour clock cannot be stopped once started, even during off-duty periods or breaks.

Electronic logging devices, or ELDs, are now mandatory for most commercial vehicles. These devices automatically record driving time, engine hours, vehicle movement, and miles driven. The ELD connects to the vehicle's engine to capture data and creates a detailed record of the driver's hours of service. Drivers must review their records daily to ensure accuracy and address any errors or omissions.

The 30-minute break rule requires drivers to take at least a 30-minute break after driving for eight cumulative hours without a break of at least 30 minutes. This break can be satisfied by any non-driving period of 30 minutes or more. During this time, the driver can be on duty performing non-driving tasks or off duty.

Weekly limits apply to prevent chronic fatigue accumulation. Drivers cannot drive after being on duty for 60 hours in seven consecutive days or 70 hours in eight consecutive days. Once reaching these limits, drivers must take a reset period of at least 34 consecutive hours off duty. This restart period allows drivers to begin a new seven or eight-day cycle.

Pre-trip and post-trip vehicle inspections are mandatory and must be documented. Before beginning each trip, drivers must conduct a thorough inspection of their vehicle, including brakes, tires, lights, steering, and cargo securement. Any defects discovered must be reported and repaired before the vehicle can be operated safely. A detailed written inspection report must be completed and signed by the driver.

Weather and road conditions can significantly impact driving time management. When conditions deteriorate, drivers must adjust their speed and driving habits accordingly. The regulations allow for emergency exceptions in extreme situations, but these instances are rare and must be properly documented."""
        },
        {
            "titre": "Diesel Engine Starting Problems: A Diagnostic Guide",
            "categorie": "mecanique",
            "contenu": """Diagnosing diesel engine starting problems requires a systematic approach to identify the root cause efficiently. Understanding the basic systems involved in engine operation helps mechanics troubleshoot issues methodically rather than randomly replacing components.

When a diesel engine fails to start, begin by checking the battery condition and electrical connections. Diesel engines require substantially more cranking power than gasoline engines due to higher compression ratios. Use a multimeter to measure battery voltage; it should read at least 12.4 volts when fully charged. Check both battery terminals for corrosion or loose connections, as these can prevent adequate current flow to the starter motor.

The glow plug system provides essential heat for cold starting diesel engines. Each cylinder contains a glow plug that heats the combustion chamber before and during starting. Test individual glow plugs using an ohmmeter; a functional glow plug should show resistance between 0.5 and 2 ohms. If one or more glow plugs fail the resistance test, they must be replaced. Also verify that the glow plug relay activates when the ignition is turned on, supplying power to the glow plugs for the appropriate duration.

Fuel delivery problems frequently cause starting difficulties in diesel engines. Check that adequate fuel exists in the tank, as fuel gauges sometimes provide inaccurate readings. Inspect the fuel lines for leaks, cracks, or loose connections that might allow air to enter the system. Air in the fuel system prevents proper engine operation and must be bled out according to manufacturer specifications.

The fuel filter can become clogged with contaminants, restricting fuel flow to the injection pump and injectors. A severely restricted fuel filter may allow the engine to start but cause it to stall shortly afterward or run roughly. Replace fuel filters at recommended intervals and whenever fuel contamination is suspected. After replacing the fuel filter, the system may need to be primed or bled to remove air.

Low compression can prevent a diesel engine from developing sufficient heat for fuel ignition. Perform a compression test on all cylinders using a diesel compression tester, which reads much higher pressures than gasoline engine testers. Diesel engines typically require compression pressures between 300 and 500 PSI for reliable starting. Compression that is too low in one or more cylinders indicates worn piston rings, damaged valves, or a blown head gasket.

The injection pump supplies high-pressure fuel to each injector at precisely timed intervals. A malfunctioning injection pump may fail to generate adequate pressure or deliver fuel at incorrect times. Testing injection pump performance requires specialized equipment and should typically be performed by technicians with specific training. If pump problems are suspected, verify all other potential causes first, as pump replacement or rebuilding represents a significant expense.

Environmental conditions affect diesel engine starting characteristics. In cold weather, diesel fuel can gel or wax, preventing it from flowing through the fuel system. Using winter-blend diesel fuel or fuel additives helps prevent cold-weather starting problems. Block heaters warm the engine coolant, making cold starts easier and reducing engine wear during startup."""
        }
    ]

def main():
    print("\n" + "="*60)
    print("🚀 INITIALISATION DE LA BASE DE DONNÉES NAT_ANG")
    print("="*60)
    
    # Créer le moteur de base de données
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        print("✅ Connexion à la base de données établie")
    except Exception as e:
        print(f"❌ Erreur de connexion : {e}")
        sys.exit(1)
    
    # Créer le compte formateur
    formateur = create_formateur()
    
    try:
        # Insérer le formateur
        session.execute(
            text("""
                INSERT INTO users (email, nom, prenom, hashed_password, role, is_active)
                VALUES (:email, :nom, :prenom, :hashed_password, 'formateur', true)
            """),
            formateur
        )
        session.commit()
        print(f"\n✅ Compte formateur créé : {formateur['email']}")
        
        # Récupérer l'ID du formateur
        result = session.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": formateur['email']}
        )
        formateur_id = result.fetchone()[0]
        
        # Insérer les documents d'exemple
        print("\n📚 Insertion des documents d'exemple...")
        documents = insert_sample_documents()
        
        for doc in documents:
            session.execute(
                text("""
                    INSERT INTO documents (titre, categorie, contenu, uploaded_by, is_public)
                    VALUES (:titre, :categorie, :contenu, :uploaded_by, true)
                """),
                {
                    **doc,
                    "uploaded_by": formateur_id
                }
            )
        
        session.commit()
        print(f"✅ {len(documents)} documents ajoutés avec succès")
        
        print("\n" + "="*60)
        print("✅ INITIALISATION TERMINÉE AVEC SUCCÈS !")
        print("="*60)
        print(f"\n📧 Email : {formateur['email']}")
        print(f"🔑 Mot de passe : [le mot de passe que vous avez saisi]")
        print(f"\n🌐 Connectez-vous maintenant sur votre application !")
        print("="*60 + "\n")
        
    except Exception as e:
        session.rollback()
        print(f"\n❌ Erreur lors de l'initialisation : {e}")
        sys.exit(1)
    finally:
        session.close()

if __name__ == "__main__":
    main()
