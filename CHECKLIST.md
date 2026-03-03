# ✅ Checklist Pré-Déploiement NAT_ANG

Utilisez cette checklist pour vérifier que vous avez tout ce qu'il faut avant de déployer.

---

## 📋 ÉTAPE 1 : Comptes et Accès

### Comptes nécessaires
- [ ] **GitHub** - Compte créé et actif
  - URL : https://github.com
  - Nom d'utilisateur : ________________
  
- [ ] **Vercel** - Compte créé (via GitHub)
  - URL : https://vercel.com
  - Connecté avec GitHub : Oui ☐  Non ☐
  
- [ ] **Railway** - Compte créé (via GitHub)
  - URL : https://railway.app
  - Connecté avec GitHub : Oui ☐  Non ☐

### Accès LWS
- [ ] **Panneau LWS** - Accès vérifié
  - Domaine possédé : dif-impact.fr
  - Accès zone DNS : Oui ☐  Non ☐
  - Identifiants LWS notés : Oui ☐  Non ☐

---

## 🗂️ ÉTAPE 2 : Fichiers du Projet

### Vérification des fichiers
- [ ] Dossier **nat-ang/** téléchargé et extrait
- [ ] Tous les sous-dossiers présents :
  - [ ] frontend/
  - [ ] backend/
  - [ ] docs/
  - [ ] database/
- [ ] Fichiers essentiels présents :
  - [ ] README.md
  - [ ] .gitignore
  - [ ] DEMARRAGE_RAPIDE.md

### Guides de documentation
- [ ] GUIDE_DEPLOIEMENT.md ✅ (À lire en PREMIER)
- [ ] CONNEXION_DOMAINE_LWS.md
- [ ] GUIDE_API_KEYS.md
- [ ] ARCHITECTURE.md

---

## 🔧 ÉTAPE 3 : Outils Locaux (Optionnel)

Ces outils ne sont PAS obligatoires pour le déploiement, mais utiles pour le développement local.

### Si vous voulez tester en local AVANT de déployer :

- [ ] **Git** installé (pour ligne de commande)
  - Windows : https://git-scm.com/download/win
  - Mac : Déjà installé normalement
  - Vérifier : `git --version` dans terminal
  
- [ ] **Node.js** installé (v18+)
  - URL : https://nodejs.org
  - Vérifier : `node --version` dans terminal
  
- [ ] **Python** installé (v3.11+)
  - URL : https://www.python.org/downloads/
  - Vérifier : `python --version` dans terminal

⚠️ **Note :** Ces outils ne sont PAS nécessaires si vous déployez directement via GitHub web interface !

---

## 📤 ÉTAPE 4 : Upload sur GitHub

### Méthode A : Via l'interface web (RECOMMANDÉ - Plus simple)
- [ ] Repository "nat-ang" créé sur GitHub
- [ ] Tous les fichiers uploadés via drag & drop
- [ ] Commit effectué avec message "Initial commit"
- [ ] Code visible dans le repository

### Méthode B : Via ligne de commande (Si vous êtes à l'aise)
- [ ] `git init` exécuté dans le dossier nat-ang/
- [ ] `git add .` exécuté
- [ ] `git commit -m "Initial commit"` exécuté
- [ ] Remote ajouté : `git remote add origin ...`
- [ ] `git push -u origin main` exécuté

**✅ Vérification :** Votre code est visible sur https://github.com/VOTRE-USERNAME/nat-ang

---

## 🗄️ ÉTAPE 5 : Base de Données (Railway)

### Création PostgreSQL
- [ ] Projet Railway créé
- [ ] Service PostgreSQL provisionné
- [ ] `DATABASE_URL` copiée et sauvegardée
  - Format : `postgresql://postgres:...@...railway.app:5432/railway`
  - Gardée en lieu sûr : Oui ☐  Non ☐

**⚠️ IMPORTANT :** Ne partagez JAMAIS cette URL publiquement !

---

## 🖥️ ÉTAPE 6 : Backend (Railway)

### Configuration Backend
- [ ] Service backend ajouté au projet Railway
- [ ] Repository GitHub lié
- [ ] Root Directory défini : `backend`
- [ ] Variables d'environnement configurées :
  - [ ] `DATABASE_URL` = [URL PostgreSQL de l'étape 5]
  - [ ] `SECRET_KEY` = [Clé aléatoire 64 caractères]
  - [ ] `ENVIRONMENT` = `production`
- [ ] Build réussi (aucune erreur dans logs)
- [ ] URL backend générée et notée
  - Format : `https://nat-ang-backend.up.railway.app`
  - URL : ____________________________________

---

## 🌐 ÉTAPE 7 : Frontend (Vercel)

### Configuration Frontend
- [ ] Projet importé sur Vercel depuis GitHub
- [ ] Framework Preset : **Vite**
- [ ] Root Directory : **frontend**
- [ ] Build Command : `npm run build`
- [ ] Output Directory : `dist`
- [ ] Variable d'environnement ajoutée :
  - [ ] `VITE_API_URL` = [URL Railway backend de l'étape 6]
- [ ] Build réussi (aucune erreur)
- [ ] URL frontend générée et notée
  - Format : `https://nat-ang.vercel.app`
  - URL : ____________________________________

**✅ Test :** Ouvrez l'URL Vercel → La page de login devrait s'afficher !

---

## 🔗 ÉTAPE 8 : Connexion Domaine LWS

### Configuration DNS
- [ ] Domaine ajouté sur Vercel : `natang.dif-impact.fr`
- [ ] Enregistrement CNAME noté :
  - Type : CNAME
  - Nom : natang
  - Valeur : cname.vercel-dns.com
- [ ] Enregistrement ajouté dans zone DNS LWS
- [ ] Propagation DNS vérifiée (5-30 min)
- [ ] Vercel affiche "Valid Configuration" ✅
- [ ] Site accessible sur : https://natang.dif-impact.fr

**✅ Test final :** Ouvrez https://natang.dif-impact.fr → Login visible !

---

## 👨‍🏫 ÉTAPE 9 : Compte Formateur

### Création du premier compte
Deux options :

#### Option A : Via script Python (recommandé)
- [ ] Script `backend/init_database.py` exécuté
- [ ] Compte formateur créé avec :
  - Email : ____________________________________
  - Mot de passe : [noté en lieu sûr]
- [ ] 3 documents d'exemple insérés

#### Option B : Via client PostgreSQL (TablePlus/pgAdmin)
- [ ] Client PostgreSQL installé et connecté
- [ ] SQL d'insertion du formateur exécuté
- [ ] SQL d'insertion des documents exécuté

**✅ Test connexion :**
- [ ] Login sur l'app avec le compte formateur
- [ ] Dashboard accessible
- [ ] 3 documents visibles

---

## 🎓 ÉTAPE 10 : Premier Code de Classe

### Création code pour inscription élèves
- [ ] Connexion en tant que formateur
- [ ] Accès au panneau **Administration**
- [ ] Code de classe créé :
  - Code : CFA2026LOG (exemple)
  - Nom : CFA Logistique 2026
  - Spécialité : Logistique
- [ ] Code noté et prêt à partager aux élèves

**✅ Test inscription élève :**
- [ ] Navigation privée ouverte
- [ ] Formulaire d'inscription rempli avec le code
- [ ] Compte élève créé avec succès
- [ ] Dashboard élève accessible
- [ ] Documents lisibles

---

## 🎯 ÉTAPE 11 : Test Complet de Lecture

### Vérification des fonctionnalités
- [ ] Clic sur un document
- [ ] Page de lecture s'affiche
- [ ] Sélection d'un mot/phrase
- [ ] Popup de traduction apparaît
- [ ] Traduction affichée (Google Translate)
- [ ] Bouton "Écouter" fonctionne (Text-to-Speech)
- [ ] Timer de lecture compte
- [ ] Retour au dashboard fonctionne

**Si tout fonctionne → 🎉 APPLICATION OPÉRATIONNELLE !**

---

## 🔑 ÉTAPE 12 : APIs Optionnelles (Si souhaité)

### Configuration avancée (voir GUIDE_API_KEYS.md)

#### DeepL (Traduction premium - Gratuit)
- [ ] Compte DeepL créé
- [ ] Clé API obtenue
- [ ] Variable `DEEPL_API_KEY` ajoutée dans Railway
- [ ] Code modifié pour utiliser DeepL

#### Gemini (Explications IA - Gratuit)
- [ ] Clé API Gemini obtenue sur Google AI Studio
- [ ] Variable `GEMINI_API_KEY` ajoutée dans Railway
- [ ] Code modifié pour utiliser Gemini

#### Claude (Explications premium - ~20€/mois)
- [ ] Compte Anthropic créé
- [ ] Clé API Claude obtenue
- [ ] Budget limite défini sur Anthropic
- [ ] Variable `CLAUDE_API_KEY` ajoutée dans Railway
- [ ] Code modifié pour utiliser Claude

---

## 📊 ÉTAPE 13 : Monitoring et Suivi

### Dashboards à surveiller
- [ ] **Railway** → Voir les logs backend en temps réel
- [ ] **Vercel** → Voir les déploiements et erreurs
- [ ] **Anthropic** (si Claude) → Usage et coûts
- [ ] **DeepL** (si activé) → Compteur de caractères

### Alertes recommandées
- [ ] Budget limite défini sur Anthropic (si Claude)
- [ ] Notifications Railway activées (erreurs)
- [ ] Notifications Vercel activées (builds échoués)

---

## 🎉 SUCCÈS !

### Vous avez maintenant :
✅ Application NAT_ANG déployée  
✅ Accessible via votre propre domaine  
✅ Base de données sécurisée  
✅ Système d'authentification fonctionnel  
✅ Traduction interactive opérationnelle  
✅ Dashboard formateur complet  

### Prochaines étapes :
1. **Créer tous vos codes de classe** pour vos différentes formations
2. **Uploader vos documents techniques** en anglais
3. **Inviter vos élèves** en leur donnant les codes
4. **Suivre leur progression** via le dashboard admin

---

## 🆘 En Cas de Problème

### Ressources d'aide
- 📖 **GUIDE_DEPLOIEMENT.md** → Instructions détaillées
- 🔧 **Section Dépannage** → Dans chaque guide
- 📝 **Logs Railway** → Voir les erreurs backend
- 📝 **Logs Vercel** → Voir les erreurs frontend
- 🌐 **Support Railway** → https://railway.app/help
- 🌐 **Support Vercel** → https://vercel.com/support

### Problèmes courants
1. **Backend ne démarre pas** → Vérifier DATABASE_URL et logs
2. **Frontend ne charge pas** → Vérifier VITE_API_URL
3. **Traduction ne fonctionne pas** → Normal, peut prendre quelques essais
4. **Domaine ne fonctionne pas** → Attendre propagation DNS (24h max)

---

**📱 Gardez cette checklist sous la main pendant votre déploiement !**

**Bon déploiement ! 🚀**
