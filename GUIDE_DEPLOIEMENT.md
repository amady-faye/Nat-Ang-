# 🚀 Guide de Déploiement NAT_ANG

Ce guide vous accompagne pas à pas pour déployer NAT_ANG sur GitHub, Vercel (frontend) et Railway (backend).

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✅ Un compte GitHub (gratuit)
- ✅ Un compte Vercel (gratuit, connexion via GitHub)
- ✅ Un compte Railway (gratuit, connexion via GitHub)
- ✅ Git installé sur votre ordinateur

---

## 🗂️ ÉTAPE 1 : Créer le Repository GitHub

### 1.1 Créer un nouveau repository

1. Allez sur https://github.com
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Configurez le repository :
   - **Repository name :** `nat-ang`
   - **Description :** "Application d'apprentissage de l'anglais naturel pour CFA"
   - **Visibility :** Private (recommandé) ou Public
   - **NE PAS** initialiser avec README, .gitignore ou license
4. Cliquez sur **"Create repository"**

### 1.2 Uploader votre code

**Option A : Via l'interface GitHub (plus simple)**

1. Sur la page de votre nouveau repository, cliquez sur **"uploading an existing file"**
2. Glissez-déposez TOUS les fichiers et dossiers du projet `nat-ang/`
3. Écrivez un message de commit : "Initial commit - NAT_ANG v1.0"
4. Cliquez sur **"Commit changes"**

**Option B : Via la ligne de commande (si vous êtes à l'aise)**

```bash
cd /chemin/vers/nat-ang
git init
git add .
git commit -m "Initial commit - NAT_ANG v1.0"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/nat-ang.git
git push -u origin main
```

---

## 🗄️ ÉTAPE 2 : Déployer la Base de Données (Railway)

### 2.1 Créer un projet Railway

1. Allez sur https://railway.app
2. Cliquez sur **"Login"** → **"Login with GitHub"**
3. Autorisez Railway à accéder à votre GitHub
4. Cliquez sur **"New Project"**
5. Sélectionnez **"Provision PostgreSQL"**
6. Un service PostgreSQL sera créé automatiquement

### 2.2 Noter les informations de connexion

1. Cliquez sur votre service **PostgreSQL**
2. Allez dans l'onglet **"Connect"**
3. Copiez la variable **`DATABASE_URL`** (elle ressemble à : `postgresql://postgres:...@...railway.app:5432/railway`)
4. **GARDEZ cette URL**, vous en aurez besoin plus tard !

---

## 🖥️ ÉTAPE 3 : Déployer le Backend (Railway)

### 3.1 Ajouter le backend au projet Railway

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"GitHub Repo"**
3. Choisissez votre repository **`nat-ang`**
4. Railway va détecter automatiquement le backend Python

### 3.2 Configurer le backend

1. Cliquez sur le service backend nouvellement créé
2. Allez dans **"Settings"** → **"Root Directory"**
3. Définissez : `backend` (pour pointer vers le dossier backend)
4. Cliquez sur **"Save"**

### 3.3 Configurer les variables d'environnement

1. Dans le service backend, allez dans l'onglet **"Variables"**
2. Cliquez sur **"+ New Variable"**
3. Ajoutez ces variables :

```
DATABASE_URL = [Collez l'URL PostgreSQL de l'étape 2.2]
SECRET_KEY = [Générez une clé aléatoire de 64 caractères - voir ci-dessous]
ENVIRONMENT = production
```

**Pour générer SECRET_KEY**, utilisez ce site : https://djecrety.ir/
Ou tapez cette commande dans un terminal :
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

4. Cliquez sur **"Deploy"** (Railway va redémarrer le service)

### 3.4 Noter l'URL du backend

1. Dans le service backend, allez dans l'onglet **"Settings"**
2. Dans la section **"Domains"**, cliquez sur **"Generate Domain"**
3. Railway va créer une URL du type : `https://nat-ang-backend.up.railway.app`
4. **COPIEZ cette URL**, vous en aurez besoin pour le frontend !

---

## 🌐 ÉTAPE 4 : Déployer le Frontend (Vercel)

### 4.1 Importer le projet sur Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Login"** → **"Continue with GitHub"**
3. Cliquez sur **"Add New..."** → **"Project"**
4. Sélectionnez votre repository **`nat-ang`**
5. Cliquez sur **"Import"**

### 4.2 Configurer le déploiement

1. Dans **"Configure Project"** :
   - **Framework Preset :** Vite
   - **Root Directory :** `frontend` (IMPORTANT !)
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`

2. Dans **"Environment Variables"**, ajoutez :

```
VITE_API_URL = [Collez l'URL Railway de l'étape 3.4]
```

Exemple : `VITE_API_URL = https://nat-ang-backend.up.railway.app`

3. Cliquez sur **"Deploy"**

### 4.3 Attendre le déploiement

Vercel va :
- Installer les dépendances npm
- Builder l'application React
- Déployer sur le CDN global

Cela prend environ **2-3 minutes**. ⏳

### 4.4 Noter l'URL du frontend

Une fois le déploiement terminé, Vercel vous donnera une URL du type :
```
https://nat-ang.vercel.app
```

**🎉 Votre application est maintenant en ligne !**

---

## 🔗 ÉTAPE 5 : Connecter votre sous-domaine LWS

Maintenant que l'app est déployée sur Vercel, connectons votre sous-domaine **natang.dif-impact.fr**.

### 5.1 Sur Vercel

1. Sur votre projet Vercel, allez dans **"Settings"** → **"Domains"**
2. Dans le champ **"Add Domain"**, tapez : `natang.dif-impact.fr`
3. Cliquez sur **"Add"**
4. Vercel va vous donner des **enregistrements DNS à configurer** :
   - Type : **CNAME**
   - Name : **natang**
   - Value : **cname.vercel-dns.com**

5. **NE FERMEZ PAS cette page**, gardez-la ouverte !

### 5.2 Sur votre panneau LWS

1. Connectez-vous à votre espace client LWS
2. Allez dans **"Gestion DNS"** ou **"Zone DNS"** pour votre domaine `dif-impact.fr`
3. Cliquez sur **"Ajouter un enregistrement"**
4. Configurez :
   - **Type :** CNAME
   - **Nom :** natang
   - **Valeur :** cname.vercel-dns.com
   - **TTL :** 3600 (par défaut)
5. Cliquez sur **"Valider"** ou **"Enregistrer"**

### 5.3 Vérification

1. Retournez sur Vercel
2. Attendez 1-5 minutes (propagation DNS)
3. Vercel affichera **"Valid Configuration"** quand c'est prêt ✅
4. Votre app sera accessible sur : **https://natang.dif-impact.fr** 🎉

**Note :** La propagation DNS peut prendre jusqu'à 24h dans de rares cas, mais c'est généralement instantané.

---

## 👨‍🏫 ÉTAPE 6 : Créer votre compte formateur

### 6.1 Insérer le compte formateur dans la base de données

Railway ne fournit pas d'interface graphique, mais vous pouvez utiliser un client PostgreSQL gratuit :

**Option A : Utiliser TablePlus (recommandé, gratuit)**

1. Téléchargez TablePlus : https://tableplus.com
2. Ouvrez TablePlus et créez une nouvelle connexion PostgreSQL
3. Collez votre `DATABASE_URL` de Railway
4. Connectez-vous

**Option B : Utiliser pgAdmin (gratuit)**

1. Téléchargez pgAdmin : https://www.pgadmin.org
2. Créez une nouvelle connexion avec les infos de Railway

### 6.2 Créer votre compte formateur

Une fois connecté à la base de données, exécutez ce SQL :

```sql
-- Créer votre compte formateur (remplacez les valeurs)
INSERT INTO users (email, nom, prenom, hashed_password, role, is_active)
VALUES (
  'votre.email@exemple.com',  -- Votre email
  'Votre Nom',                 -- Votre nom
  'Votre Prénom',              -- Votre prénom
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7.fGEKoFPi',  -- Mot de passe : "password123"
  'formateur',
  true
);
```

**⚠️ IMPORTANT :** Ce mot de passe temporaire est `password123`. 
Changez-le immédiatement après votre première connexion !

**Pour générer un nouveau mot de passe hashé**, utilisez ce code Python :

```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
print(pwd_context.hash("VotreMotDePasseIci"))
```

### 6.3 Insérer les documents d'exemple

Copiez le contenu de `/database/sample_documents.md` et insérez-les via SQL :

```sql
-- Document 1 : Logistique
INSERT INTO documents (titre, categorie, contenu, uploaded_by, is_public)
VALUES (
  'Warehouse Safety Procedures',
  'logistique',
  'Warehouse safety is a critical aspect...[CONTENU COMPLET]',
  1,  -- ID de votre compte formateur
  true
);

-- Document 2 : Transport
INSERT INTO documents (titre, categorie, contenu, uploaded_by, is_public)
VALUES (
  'Understanding Hours of Service Regulations for Truck Drivers',
  'transport',
  'Commercial truck drivers must comply...[CONTENU COMPLET]',
  1,
  true
);

-- Document 3 : Mécanique
INSERT INTO documents (titre, categorie, contenu, uploaded_by, is_public)
VALUES (
  'Diesel Engine Starting Problems: A Diagnostic Guide',
  'mecanique',
  'Diagnosing diesel engine starting problems...[CONTENU COMPLET]',
  1,
  true
);
```

---

## ✅ ÉTAPE 7 : Tester l'application

### 7.1 Connexion formateur

1. Allez sur **https://natang.dif-impact.fr** (ou votre URL Vercel)
2. Cliquez sur **"Se connecter"**
3. Utilisez vos identifiants formateur
4. Vous devriez voir le dashboard avec les 3 documents

### 7.2 Créer un code de classe

1. Cliquez sur **"Administration"**
2. Cliquez sur **"Créer un code de classe"**
3. Remplissez :
   - Code : **CFA2026LOG**
   - Nom : **CFA Logistique 2026**
   - Spécialité : **Logistique**
4. Cliquez sur **"Créer"**

### 7.3 Tester l'inscription élève

1. Ouvrez un **navigateur privé** (incognito)
2. Allez sur l'app
3. Cliquez sur **"S'inscrire"**
4. Remplissez le formulaire avec le code **CFA2026LOG**
5. Vous devriez accéder au dashboard

### 7.4 Tester la lecture

1. Cliquez sur un document
2. Sélectionnez un mot ou une phrase
3. La traduction devrait apparaître ! 🎉

---

## 🔑 Prochaines étapes (Optionnel)

### Ajouter l'API Claude (quand vous l'aurez)

1. Obtenez votre clé API sur : https://console.anthropic.com
2. Dans Railway, ajoutez la variable :
   ```
   CLAUDE_API_KEY = votre_cle_api_claude
   ```
3. Les explications grammaticales utiliseront Claude automatiquement !

### Ajouter DeepL pour de meilleures traductions

1. Obtenez une clé API sur : https://www.deepl.com/pro-api
2. Dans Railway, ajoutez :
   ```
   DEEPL_API_KEY = votre_cle_deepl
   ```
3. Modifiez le code dans `/backend/app/api/reading.py` pour utiliser DeepL au lieu de Google Translate

---

## 🆘 Dépannage

### Le backend ne démarre pas sur Railway

1. Vérifiez les logs dans Railway → Service Backend → "Deployments" → Dernier déploiement → "View Logs"
2. Vérifiez que `DATABASE_URL` est bien configurée
3. Vérifiez que le Root Directory est bien `backend`

### Le frontend ne charge pas

1. Vérifiez que `VITE_API_URL` pointe vers votre URL Railway
2. Videz le cache du navigateur (Ctrl+Shift+R)
3. Vérifiez les logs de build sur Vercel

### Les traductions ne fonctionnent pas

La bibliothèque `googletrans` peut parfois être bloquée. Solutions :
1. Attendez quelques minutes et réessayez
2. Utilisez DeepL API (voir "Prochaines étapes")
3. Ou ajoutez Google Cloud Translation API

### Le sous-domaine ne fonctionne pas

1. Vérifiez que l'enregistrement CNAME est correct dans LWS
2. Attendez 24h pour la propagation DNS complète
3. Utilisez https://dnschecker.org pour vérifier la propagation

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs (Railway et Vercel)
2. Consultez ce guide attentivement
3. Googlez l'erreur exacte
4. Contactez le support Vercel/Railway (très réactifs)

---

**🎉 Félicitations ! Votre application NAT_ANG est maintenant déployée et accessible à vos élèves !**
