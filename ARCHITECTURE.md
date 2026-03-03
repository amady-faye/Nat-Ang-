# 🏗️ Architecture Technique NAT_ANG

## Vue d'ensemble du système

```
┌─────────────────────────────────────────────────────────────────┐
│                      UTILISATEURS                                │
│                                                                   │
│  👨‍🏫 Formateurs          👨‍🎓 Apprenants (Élèves CFA)         │
│     │                         │                                  │
│     └─────────────┬───────────┘                                  │
│                   │                                              │
│                   ▼                                              │
│         https://natang.dif-impact.fr                            │
│                   │                                              │
└───────────────────┼──────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                             │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React 18 + Vite                                          │  │
│  │  • Pages : Login, Register, Dashboard, Reading, Admin    │  │
│  │  • Components : Traduction popup, Lecture interactive    │  │
│  │  • State : Zustand (auth, documents)                      │  │
│  │  • Styling : Tailwind CSS                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Déploiement automatique depuis GitHub                          │
│  CDN global pour performance maximale                           │
│                                                                   │
└───────────────────┬───────────────────────────────────────────────┘
                    │ HTTPS/REST API
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Railway)                              │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  FastAPI (Python 3.11)                                    │  │
│  │                                                             │  │
│  │  Endpoints :                                               │  │
│  │  • /api/auth/*     → Authentification JWT                 │  │
│  │  • /api/documents/* → Gestion documents                   │  │
│  │  • /api/reading/*   → Traduction & Explications          │  │
│  │  • /api/admin/*     → Stats & Gestion formateurs         │  │
│  │                                                             │  │
│  │  Services :                                                │  │
│  │  • SQLAlchemy ORM                                          │  │
│  │  • JWT Security                                            │  │
│  │  • PyPDF2 (extraction PDF)                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Déploiement automatique depuis GitHub                          │
│  Auto-scaling selon la charge                                   │
│                                                                   │
└─────────┬─────────────────────────────┬─────────────────────────┘
          │                             │
          │ SQL                         │ HTTP APIs
          ▼                             ▼
┌──────────────────────┐    ┌─────────────────────────────────────┐
│  DATABASE (Railway)  │    │    SERVICES EXTERNES                │
│                      │    │                                     │
│  PostgreSQL 14+      │    │  ┌────────────────────────────┐   │
│                      │    │  │ Google Translate API       │   │
│  Tables :            │    │  │ • Traduction EN → FR       │   │
│  • users             │    │  │ • Gratuit (via googletrans)│   │
│  • documents         │    │  └────────────────────────────┘   │
│  • reading_progress  │    │                                     │
│  • classe_codes      │    │  ┌────────────────────────────┐   │
│                      │    │  │ DeepL API (Optionnel)      │   │
│  Backup automatique  │    │  │ • Traduction premium       │   │
│  SSL/TLS chiffré     │    │  │ • 500k chars/mois gratuit  │   │
│                      │    │  └────────────────────────────┘   │
└──────────────────────┘    │                                     │
                            │  ┌────────────────────────────┐   │
                            │  │ Claude API (Optionnel)     │   │
                            │  │ • Explications grammaire   │   │
                            │  │ • Pédagogie avancée        │   │
                            │  │ • ~20€/mois                │   │
                            │  └────────────────────────────┘   │
                            │                                     │
                            │  ┌────────────────────────────┐   │
                            │  │ Gemini API (Optionnel)     │   │
                            │  │ • Alternative gratuite     │   │
                            │  │ • Explications IA          │   │
                            │  └────────────────────────────┘   │
                            └─────────────────────────────────────┘
```

---

## Flux de données principaux

### 1️⃣ Inscription Élève

```
Élève → Frontend (Formulaire)
         │
         ├─ Données : email, nom, prenom, password, code_classe
         │
         ▼
      Backend (/api/auth/register)
         │
         ├─ Vérification code_classe dans DB
         ├─ Hash du mot de passe (bcrypt)
         ├─ Création user avec role="apprenant"
         │
         ▼
      PostgreSQL (INSERT users)
         │
         ├─ Génération JWT token
         │
         ▼
      Frontend (Connexion auto + redirect dashboard)
```

### 2️⃣ Lecture et Traduction

```
Élève sélectionne texte → Frontend (mouseup event)
                             │
                             ├─ Texte : "The forklift must..."
                             │
                             ▼
                          Backend (/api/reading/translate)
                             │
                             ├─ Envoi à Google Translate
                             ├─ EN → FR
                             │
                             ▼
                          Google Translate API
                             │
                             ├─ Traduction : "Le chariot élévateur doit..."
                             │
                             ▼
                          Frontend (Popup traduction)
                             │
                             └─ Affichage au-dessus du texte sélectionné
```

### 3️⃣ Upload Document (Formateur)

```
Formateur → Frontend (Upload PDF)
              │
              ├─ Fichier PDF binaire
              │
              ▼
           Backend (/api/documents/upload-pdf)
              │
              ├─ Lecture PDF avec PyPDF2
              ├─ Extraction texte brut
              ├─ Sauvegarde metadata
              │
              ▼
           PostgreSQL (INSERT documents)
              │
              └─ Document visible par tous les élèves
```

### 4️⃣ Suivi Progression

```
Élève lit document → Frontend (Timer + scroll tracking)
                        │
                        ├─ Toutes les 30 secondes
                        ├─ Données : temps_lecture, paragraphe, %complete
                        │
                        ▼
                     Backend (/api/reading/progress)
                        │
                        ▼
                     PostgreSQL (UPDATE reading_progress)
                        │
                        └─ Visible dans dashboard formateur
```

---

## Sécurité

### Authentification
- **JWT Tokens** : Expiration 7 jours
- **bcrypt** : Hash mots de passe (rounds=12)
- **HTTPS** : Toutes les communications chiffrées
- **CORS** : Restreint aux domaines autorisés

### Base de données
- **PostgreSQL SSL** : Connexions chiffrées
- **Variables d'environnement** : Secrets jamais en code
- **Backup automatique** : Railway snapshots quotidiens

### API externes
- **Rate limiting** : Protection contre abus
- **Timeouts** : 10 secondes max par requête
- **Error handling** : Pas de fuites d'informations

---

## Performance

### Frontend (Vercel)
- **CDN Global** : Latence < 50ms partout
- **Compression Gzip** : Réduction 70% taille
- **Code splitting** : Chargement progressif
- **Cache agressif** : Assets statiques 1 an

### Backend (Railway)
- **Auto-scaling** : Instances selon charge
- **Connection pooling** : PostgreSQL optimisé
- **Async I/O** : FastAPI non-bloquant
- **Response caching** : Documents fréquents

### Base de données
- **Index** : Sur email, document_id, user_id
- **Queries optimisées** : JOINs efficaces
- **Partitionnement** : Possible si > 100k docs

---

## Scalabilité

### Capacité actuelle (Plan gratuit)

| Métrique | Limite | Usage estimé (30 élèves) |
|----------|--------|--------------------------|
| Requêtes/jour | 100k | ~5k (5%) |
| Stockage DB | 512 MB | ~50 MB (10%) |
| Bande passante | 100 GB/mois | ~10 GB (10%) |
| Concurrent users | 50 | ~10 (20%) |

### Évolution possible

**Phase 1 (0-100 élèves)** : Plan gratuit suffisant  
**Phase 2 (100-500 élèves)** : Railway Hobby ($5/mois)  
**Phase 3 (500-2000 élèves)** : Railway Pro ($20/mois) + Vercel Pro ($20/mois)

---

## Monitoring

### Vercel Dashboard
- ✅ Déploiements réussis/échoués
- ✅ Temps de réponse moyen
- ✅ Erreurs 4xx/5xx
- ✅ Trafic géographique

### Railway Dashboard
- ✅ CPU / RAM usage
- ✅ Database connections
- ✅ Response times
- ✅ Logs en temps réel

### Custom Metrics (À ajouter)
- Documents lus par jour
- Mots traduits par jour
- Temps moyen par document
- Taux de complétion

---

## Backup & Disaster Recovery

### Base de données
- **Snapshots automatiques** : Quotidiens (Railway)
- **Point-in-time recovery** : 7 jours
- **Export manuel** : Possible via pgAdmin

### Code source
- **Git history** : Historique complet
- **GitHub backup** : Copie distante
- **Branches** : main (prod) + dev (test)

### Données utilisateurs
- **RGPD compliant** : Données personnelles chiffrées
- **Export possible** : Format JSON/CSV
- **Suppression** : Hard delete si demandé

---

## Technologies Détaillées

### Frontend Stack
```
React 18.2.0
├── react-router-dom 6.21.1  (Navigation)
├── axios 1.6.5              (HTTP client)
├── zustand 4.4.7            (State management)
├── tailwindcss 3.4.1        (Styling)
└── lucide-react 0.303.0     (Icons)
```

### Backend Stack
```
Python 3.11
├── fastapi 0.109.0          (API framework)
├── uvicorn 0.27.0           (ASGI server)
├── sqlalchemy 2.0.25        (ORM)
├── psycopg2-binary 2.9.9    (PostgreSQL driver)
├── python-jose 3.3.0        (JWT)
├── passlib 1.7.4            (Password hashing)
└── PyPDF2 3.0.1             (PDF extraction)
```

### Infrastructure
```
Vercel (Frontend hosting)
Railway (Backend + Database)
PostgreSQL 14+ (Database)
GitHub (Code repository)
```

---

## Roadmap Technique V2

### Prochaines améliorations
- [ ] **Redis cache** : Pour traductions fréquentes
- [ ] **Websockets** : Notifications temps réel
- [ ] **Elastic Search** : Recherche full-text avancée
- [ ] **Queue system** : Jobs asynchrones (Celery)
- [ ] **Analytics** : Grafana + Prometheus
- [ ] **Mobile apps** : React Native
- [ ] **Offline mode** : PWA + Service Workers

---

**Cette architecture est conçue pour être simple, robuste et évolutive !** 🚀
