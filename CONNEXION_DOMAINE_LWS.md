# 🌐 Guide de Connexion du Sous-Domaine LWS à Vercel

Ce guide vous aide à connecter votre sous-domaine **natang.dif-impact.fr** (ou **nat_ang.dif-impact.fr**) à votre application déployée sur Vercel.

---

## 📋 Prérequis

- ✅ Votre application est déployée sur Vercel
- ✅ Vous avez accès à votre panneau LWS
- ✅ Vous possédez le domaine `dif-impact.fr`

---

## 🎯 Choix du sous-domaine

Vous avez deux options :

### Option A (Recommandée) : natang.dif-impact.fr
- ✅ Plus court et professionnel
- ✅ Pas de caractères spéciaux

### Option B : nat-ang.dif-impact.fr (avec tiret)
- ℹ️ Fonctionne aussi très bien
- ℹ️ Underscore `_` dans les URLs est déconseillé, utilisez le tiret `-`

**Pour ce guide, nous utiliserons : `natang.dif-impact.fr`**

---

## 🚀 PARTIE 1 : Configuration sur Vercel

### Étape 1 : Accéder aux paramètres de domaine

1. Connectez-vous sur **https://vercel.com**
2. Sélectionnez votre projet **nat-ang**
3. Cliquez sur l'onglet **"Settings"**
4. Dans le menu latéral, cliquez sur **"Domains"**

### Étape 2 : Ajouter votre sous-domaine

1. Dans le champ texte **"Enter domain"**, tapez :
   ```
   natang.dif-impact.fr
   ```

2. Cliquez sur le bouton **"Add"**

3. Vercel va afficher un message indiquant que le domaine doit être configuré

### Étape 3 : Noter les informations DNS

Vercel vous fournira des enregistrements DNS à configurer :

```
Type: CNAME
Name: natang
Value: cname.vercel-dns.com
```

**⚠️ IMPORTANT : Gardez cet onglet ouvert !** Vous en aurez besoin pour vérifier plus tard.

---

## 🔧 PARTIE 2 : Configuration sur LWS

### Étape 1 : Accéder au panneau LWS

1. Connectez-vous sur **https://www.lws.fr** (ou votre URL de connexion LWS)
2. Allez dans **"Mes services"** ou **"Mes domaines"**
3. Trouvez et cliquez sur votre domaine **dif-impact.fr**

### Étape 2 : Accéder à la gestion DNS

Selon l'interface LWS, cherchez l'une de ces options :
- **"Gestion DNS"**
- **"Zone DNS"**
- **"Gérer la zone DNS"**
- **"DNS Management"**

### Étape 3 : Ajouter l'enregistrement CNAME

1. Cliquez sur **"Ajouter un enregistrement"** ou **"+ Nouvelle entrée"**

2. Remplissez les champs suivants :

   ```
   Type d'enregistrement : CNAME
   
   Nom / Host / Sous-domaine : natang
   
   Valeur / Pointe vers / Target : cname.vercel-dns.com
   
   TTL (Time To Live) : 3600 (ou laissez par défaut)
   ```

3. **NE PAS** ajouter le domaine complet dans "Nom"
   - ✅ CORRECT : `natang`
   - ❌ INCORRECT : `natang.dif-impact.fr`

4. Cliquez sur **"Valider"**, **"Enregistrer"** ou **"Ajouter"**

### Exemple visuel de la configuration :

```
┌─────────────────────────────────────────────────┐
│  Type        │  CNAME                           │
│  Nom         │  natang                          │
│  Valeur      │  cname.vercel-dns.com            │
│  TTL         │  3600                            │
└─────────────────────────────────────────────────┘
```

---

## ✅ PARTIE 3 : Vérification

### Étape 1 : Vérifier sur LWS

1. Assurez-vous que l'enregistrement CNAME est bien ajouté dans la liste
2. Il devrait apparaître comme :
   ```
   natang.dif-impact.fr  →  CNAME  →  cname.vercel-dns.com
   ```

### Étape 2 : Vérifier sur Vercel

1. Retournez sur Vercel (onglet **"Domains"**)
2. Rafraîchissez la page après **1-5 minutes**
3. Le statut devrait passer à :
   ```
   ✅ Valid Configuration
   ```

### Étape 3 : Tester le domaine

1. Ouvrez un nouvel onglet
2. Tapez dans la barre d'adresse :
   ```
   https://natang.dif-impact.fr
   ```

3. Votre application NAT_ANG devrait s'afficher ! 🎉

---

## ⏱️ Délais de Propagation DNS

### Cas normal (90% des cas)
- **Propagation :** 5-30 minutes
- Vous pourrez accéder à votre app rapidement

### Cas rare
- **Propagation maximale :** 24-48 heures
- Si après 2h ça ne fonctionne toujours pas, vérifiez la configuration

---

## 🔍 Outils de Vérification

### Vérifier la propagation DNS

Utilisez ce site gratuit : **https://dnschecker.org**

1. Entrez votre domaine : `natang.dif-impact.fr`
2. Sélectionnez le type : **CNAME**
3. Cliquez sur **"Search"**
4. Vérifiez que la valeur affichée est bien : `cname.vercel-dns.com`

### Vérifier le certificat SSL

Vercel génère automatiquement un certificat SSL (HTTPS) :
- ⏱️ Génération : 30 secondes à 5 minutes après validation DNS
- 🔒 Le cadenas vert apparaîtra dans votre navigateur

---

## 🆘 Dépannage

### Erreur : "Domain not found" ou "DNS_PROBE_FINISHED_NXDOMAIN"

**Causes possibles :**
1. L'enregistrement CNAME n'est pas encore propagé → Attendez 15-30 min
2. Le nom du sous-domaine est incorrect dans LWS
3. Le TTL est trop élevé

**Solutions :**
- Vérifiez que vous avez bien tapé `natang` (sans le domaine complet)
- Videz le cache DNS de votre ordinateur :
  ```
  Windows : ipconfig /flushdns
  Mac : sudo dscacheutil -flushcache
  Linux : sudo systemd-resolve --flush-caches
  ```

### Erreur : "Invalid Configuration" sur Vercel

**Solutions :**
1. Vérifiez que la valeur dans LWS est exactement : `cname.vercel-dns.com`
2. Supprimez et recréez l'enregistrement CNAME
3. Attendez quelques minutes et rafraîchissez Vercel

### Le domaine fonctionne mais pas le HTTPS

**Solution :**
- Attendez 5-10 minutes supplémentaires
- Vercel génère automatiquement le certificat SSL
- Aucune action manuelle n'est requise

### Ancienne configuration qui interfère

Si vous aviez déjà un enregistrement pour `natang` :
1. **Supprimez** l'ancien enregistrement dans LWS
2. **Ajoutez** le nouveau CNAME pointant vers Vercel
3. Attendez la propagation

---

## 📧 Support LWS

Si vous rencontrez des difficultés avec la configuration DNS sur LWS :

**Contact LWS :**
- 📞 Téléphone : Voir votre espace client
- 💬 Chat en ligne : Disponible sur lws.fr
- 📧 Email : Via votre espace client

**Informations à fournir au support :**
- Votre domaine : `dif-impact.fr`
- Sous-domaine à créer : `natang`
- Type d'enregistrement : CNAME
- Valeur : `cname.vercel-dns.com`

---

## ✅ Checklist Finale

Avant de déclarer victoire, vérifiez :

- [ ] L'enregistrement CNAME est bien configuré dans LWS
- [ ] Vercel affiche "Valid Configuration"
- [ ] Le domaine `https://natang.dif-impact.fr` est accessible
- [ ] Le certificat SSL (cadenas vert) est actif
- [ ] Vous pouvez vous connecter à l'application
- [ ] Les élèves peuvent s'inscrire avec un code de classe

---

## 🎉 Félicitations !

Votre application **NAT_ANG** est maintenant accessible via votre propre domaine professionnel :

```
🌐 https://natang.dif-impact.fr
```

Vous pouvez maintenant :
1. Créer des codes de classe
2. Inscrire vos élèves
3. Uploader des documents
4. Suivre leur progression

**Bon enseignement ! 📚**
