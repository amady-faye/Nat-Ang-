# 🔑 Guide d'Obtention des Clés API

Ce guide vous aide à obtenir les clés API nécessaires pour NAT_ANG.

---

## 📋 Vue d'ensemble

NAT_ANG utilise (ou peut utiliser) plusieurs services externes :

| Service | Statut | Coût | Usage |
|---------|--------|------|-------|
| **Google Translate** | ✅ Inclus | Gratuit | Traduction de base (V1) |
| **Claude API** | ⚪ Optionnel | Payant | Explications grammaticales |
| **Gemini API** | ⚪ Optionnel | Gratuit* | Alternative à Claude |
| **DeepL API** | ⚪ Optionnel | Gratuit/Payant | Traduction premium |

**Note :** Seule Google Translate est activée par défaut (via la bibliothèque `googletrans`). Les autres sont optionnels mais améliorent l'expérience.

---

## 🤖 Claude API (Anthropic)

### Pourquoi ?
Claude fournit des **explications grammaticales** et **pédagogiques** de haute qualité, parfaites pour l'apprentissage.

### Comment obtenir la clé ?

1. **Créer un compte Anthropic**
   - Allez sur https://console.anthropic.com
   - Cliquez sur **"Sign Up"**
   - Utilisez votre email professionnel

2. **Ajouter une méthode de paiement**
   - Dans le menu, allez à **"Billing"**
   - Ajoutez une carte de crédit
   - Définissez un **budget mensuel** (recommandé : 20-50€)

3. **Générer une clé API**
   - Allez dans **"API Keys"**
   - Cliquez sur **"Create Key"**
   - Donnez-lui un nom : `NAT_ANG Production`
   - Copiez la clé : `sk-ant-api03-...` (elle commence toujours par `sk-ant-`)

4. **Ajouter à Railway**
   - Dans votre service backend Railway
   - Variables → New Variable
   - `CLAUDE_API_KEY = sk-ant-api03-...`

### Coûts estimés

Pour une classe de **30 élèves actifs** :
- Utilisation moyenne : **10-20€/mois**
- Utilisation intensive : **30-50€/mois**

**Astuce :** Définissez un budget limite sur Anthropic pour éviter les surprises.

### Code à modifier (si vous ajoutez Claude)

Dans `/backend/app/api/reading.py`, remplacez la fonction `explain_with_ai` :

```python
import anthropic

@router.post("/explain")
async def explain_with_ai(
    request: ExplanationRequest,
    current_user: User = Depends(get_current_user)
):
    client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))
    
    prompt = f"""Tu es un professeur d'anglais spécialisé en formations professionnelles.
    
Texte : "{request.text}"
Contexte : {request.context or "Document technique professionnel"}
Type d'aide : {request.type}

Fournis une explication claire et pédagogique en français pour un apprenant de niveau A2-B1."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return {
        "text": request.text,
        "type": request.type,
        "explanation": message.content[0].text
    }
```

---

## 🌐 DeepL API (Traduction Premium)

### Pourquoi ?
DeepL offre des **traductions de meilleure qualité** que Google Translate, surtout pour le vocabulaire technique.

### Comment obtenir la clé ?

1. **Créer un compte DeepL**
   - Allez sur https://www.deepl.com/pro-api
   - Cliquez sur **"S'inscrire gratuitement"**

2. **Choisir le plan Free**
   - **Plan Free :** 500 000 caractères/mois GRATUITS
   - Parfait pour commencer !
   - Pas de carte de crédit requise

3. **Obtenir la clé API**
   - Dans le tableau de bord DeepL
   - Allez dans **"Account"** → **"API Keys"**
   - Copiez votre clé : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx`

4. **Ajouter à Railway**
   ```
   DEEPL_API_KEY = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
   ```

### Coûts estimés

- **Free :** 500k caractères/mois (suffisant pour ~30 élèves modérés)
- **Pro :** 5,49€ / 250k caractères supplémentaires

### Code à modifier

Dans `/backend/app/api/reading.py` :

```python
import deepl

@router.post("/translate")
async def translate_text(
    request: TranslationRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        # Utiliser DeepL si la clé est disponible
        deepl_key = os.getenv("DEEPL_API_KEY")
        
        if deepl_key:
            translator = deepl.Translator(deepl_key)
            result = translator.translate_text(
                request.text,
                source_lang=request.source_lang.upper(),
                target_lang=request.target_lang.upper()
            )
            return {
                "original": request.text,
                "translated": result.text,
                "source_lang": request.source_lang,
                "target_lang": request.target_lang
            }
        else:
            # Fallback sur Google Translate
            translation = translator.translate(...)
            # ... code existant
    except Exception as e:
        # ... gestion erreur
```

Ajoutez aussi dans `requirements.txt` :
```
deepl==1.16.1
```

---

## 🔮 Gemini API (Google)

### Pourquoi ?
Alternative **gratuite** à Claude pour les explications grammaticales. Moins performant mais très correct.

### Comment obtenir la clé ?

1. **Accéder à Google AI Studio**
   - Allez sur https://makersuite.google.com/app/apikey
   - Connectez-vous avec votre compte Google

2. **Créer une clé API**
   - Cliquez sur **"Create API Key"**
   - Sélectionnez un projet Google Cloud (ou créez-en un)
   - Copiez la clé : `AIzaSy...`

3. **Ajouter à Railway**
   ```
   GEMINI_API_KEY = AIzaSy...
   ```

### Coûts

**GRATUIT** jusqu'à :
- 60 requêtes/minute
- 1500 requêtes/jour
- Largement suffisant pour votre usage !

### Code à modifier

Dans `/backend/app/api/reading.py` :

```python
import google.generativeai as genai

@router.post("/explain")
async def explain_with_ai(
    request: ExplanationRequest,
    current_user: User = Depends(get_current_user)
):
    # Essayer Claude d'abord, puis Gemini en fallback
    claude_key = os.getenv("CLAUDE_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if claude_key:
        # Utiliser Claude (code précédent)
        pass
    elif gemini_key:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Tu es un professeur d'anglais...
        [même prompt que pour Claude]"""
        
        response = model.generate_content(prompt)
        
        return {
            "text": request.text,
            "type": request.type,
            "explanation": response.text
        }
    else:
        # Réponse mockée (comme actuellement)
        pass
```

Ajoutez dans `requirements.txt` :
```
google-generativeai==0.3.2
```

---

## 🎯 Recommandation de Configuration

### Pour démarrer (Budget : 0€)
```env
# Pas besoin de clés supplémentaires !
# Google Translate est déjà intégré
```
→ Les traductions de base fonctionnent déjà ✅

### Pour une meilleure expérience (Budget : 0€)
```env
DEEPL_API_KEY = xxx  # Plan Free (gratuit)
GEMINI_API_KEY = xxx  # Gratuit
```
→ Meilleures traductions + explications IA gratuites

### Pour l'excellence pédagogique (Budget : ~20-30€/mois)
```env
DEEPL_API_KEY = xxx
CLAUDE_API_KEY = xxx  # Payant mais excellent
```
→ Meilleure expérience globale pour vos élèves

---

## 🔒 Sécurité des Clés API

### ⚠️ À NE JAMAIS FAIRE

- ❌ Mettre les clés dans le code source
- ❌ Commit les clés sur GitHub
- ❌ Partager les clés par email non chiffré

### ✅ Bonnes Pratiques

- ✅ Utiliser les variables d'environnement (Railway)
- ✅ Définir des budgets limites
- ✅ Régénérer les clés si compromises
- ✅ Utiliser des clés différentes pour dev/prod

---

## 📊 Monitoring de l'Usage

### Claude (Anthropic)
- Dashboard : https://console.anthropic.com
- Voir l'utilisation en temps réel
- Définir des alertes de budget

### DeepL
- Dashboard : https://www.deepl.com/pro-account
- Compteur de caractères utilisés
- Notification quand on approche la limite

### Gemini (Google)
- Console : https://console.cloud.google.com
- Quotas et métriques
- Alertes de dépassement

---

## 🆘 Dépannage

### Erreur : "API key invalid"
- Vérifiez que la clé est correctement copiée (pas d'espaces)
- Vérifiez que la variable d'environnement est bien définie dans Railway
- Redémarrez le service backend après avoir ajouté la variable

### Erreur : "Quota exceeded"
- Vérifiez votre usage sur le dashboard du service
- Attendez le renouvellement du quota (généralement quotidien)
- Passez à un plan payant si nécessaire

### Les explications ne fonctionnent pas
- Vérifiez que au moins Claude OU Gemini est configuré
- Vérifiez les logs Railway pour voir les erreurs
- Testez la clé API dans un script Python indépendant

---

## 📞 Support

### Anthropic (Claude)
- Documentation : https://docs.anthropic.com
- Support : support@anthropic.com

### DeepL
- Documentation : https://www.deepl.com/docs-api
- Support : Via le formulaire dans l'espace client

### Google (Gemini)
- Documentation : https://ai.google.dev/docs
- Forum : https://discuss.ai.google.dev

---

**💡 Conseil :** Commencez sans clés API supplémentaires, testez l'application avec vos élèves, puis ajoutez les services premium si nécessaire !
