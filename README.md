# 📚 NAT_ANG - Anglais Naturel

**Application d'apprentissage de l'anglais par la lecture immersive**  
Conçue spécialement pour les apprenants en CFA (Logistique, Transport, Mécanique)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🎯 Concept

NAT_ANG s'inspire de **Clew** et propose une approche pédagogique innovante :
- 📖 **Lecture de documents techniques** en anglais adaptés aux métiers
- 🔄 **Traduction instantanée** au clic sur n'importe quel mot/phrase
- 🤖 **Explications IA** via Claude pour la grammaire et le vocabulaire
- 📊 **Suivi de progression** pour les formateurs

---

## ✨ Fonctionnalités

### Pour les Apprenants
- ✅ Lecture interactive de documents techniques
- ✅ Traduction instantanée (Google Translate / DeepL)
- ✅ Explications grammaticales via IA
- ✅ Prononciation audio (Text-to-Speech)
- ✅ Suivi personnel de progression
- ✅ Documents catégorisés par spécialité

### Pour les Formateurs
- ✅ Upload de documents texte ou PDF
- ✅ Création de codes de classe pour l'inscription
- ✅ Dashboard de suivi des élèves
- ✅ Statistiques de lecture et temps passé
- ✅ Gestion par catégorie (Logistique, Transport, Mécanique)

---

## 🛠️ Technologies

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** pour le style
- **Zustand** pour la gestion d'état
- **React Router** pour la navigation
- **Axios** pour les appels API

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** ORM
- **PostgreSQL** base de données
- **JWT** authentification
- **Google Translate** / **DeepL** API
- **Claude API** (Anthropic) pour les explications

---

## 🚀 Déploiement

### Architecture
```
Frontend (Vercel) → Backend (Railway) → PostgreSQL (Railway)
                         ↓
              APIs externes (Google Translate, Claude)
```

### Guides complets
📘 **[Guide de déploiement détaillé](docs/GUIDE_DEPLOIEMENT.md)** - Suivez ce guide pas à pas !

### Déploiement rapide

1. **Fork ce repository**
2. **Déployez le backend sur Railway :**
   - Connectez votre repo GitHub
   - Ajoutez un service PostgreSQL
   - Configurez les variables d'environnement
3. **Déployez le frontend sur Vercel :**
   - Importez le repo
   - Configurez `VITE_API_URL`
4. **Connectez votre domaine LWS**

---

## 🔧 Installation locale (Développement)

### Prérequis
- Python 3.11+
- Node.js 18+
- PostgreSQL (ou SQLite pour tests)

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Éditez .env avec vos configurations

# Lancer le serveur
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Éditez .env avec l'URL du backend

# Lancer le serveur de dev
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

---

## 📖 Documents d'exemple

Le projet inclut 3 documents techniques d'exemple :
1. **Warehouse Safety Procedures** (Logistique)
2. **Hours of Service Regulations** (Transport)
3. **Diesel Engine Troubleshooting** (Mécanique)

Voir `/database/sample_documents.md` pour les contenus complets.

---

## 🎨 Interface

L'interface s'inspire de **Clew** avec :
- Design épuré et moderne
- Lecture confortable (typographie optimisée)
- Navigation intuitive
- Traduction en popup élégant
- Mobile-friendly

---

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés (bcrypt)
- ✅ Validation des entrées (Pydantic)
- ✅ Protection CORS
- ✅ Variables d'environnement sécurisées

---

## 📊 Roadmap (V2)

Fonctionnalités prévues :
- [ ] Système de progression obligatoire (parcours forcé)
- [ ] Dashboard formateur amélioré
- [ ] Rappels grammaticaux contextuels
- [ ] Simplification automatique de texte (A2/B1/B2)
- [ ] Exercices interactifs
- [ ] Badges et gamification
- [ ] Export des statistiques (PDF/Excel)
- [ ] Intégration Gemini pour variation des explications

---

## 🤝 Contribution

Ce projet est spécifiquement conçu pour les besoins du CFA, mais toute suggestion est bienvenue !

---

## 📄 License

MIT License - Voir le fichier LICENSE pour plus de détails

---

## 👤 Auteur

**Formateur Anglais - CFA**  
Spécialisé en Logistique, Transport routier, Mécanique

---

## 🙏 Remerciements

- Inspiration : **Clew** (application d'apprentissage par lecture)
- IA : **Claude** (Anthropic) pour les explications pédagogiques
- Communauté open-source pour les bibliothèques utilisées

---

**⭐ Si ce projet vous aide, n'hésitez pas à le star sur GitHub !**
