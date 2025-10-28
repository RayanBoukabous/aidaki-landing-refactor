# Chatbot Multilingue AIDAKI 🤖🌍

## Fonctionnalités

### ✅ Détection Automatique de Langue
- **Français** : Détection par défaut
- **Arabe** : Détection via caractères arabes (Unicode \u0600-\u06FF)
- **Anglais** : Détection via mots-clés anglais communs
- **Changement dynamique** : L'utilisateur peut changer de langue en cours de conversation

### ✅ Support RTL/LTR
- **Français (LTR)** : Texte de gauche à droite
- **Arabe (RTL)** : Texte de droite à gauche
- **Anglais (LTR)** : Texte de gauche à droite
- **Styles adaptatifs** : Police et alignement selon la langue

### ✅ Messages Multilingues
- **Messages de bienvenue** : Adaptés à la langue détectée
- **Messages d'erreur** : Traduits selon la langue
- **Placeholders** : Input adapté à la langue

### ✅ API Intelligente
- **Trois fichiers de données** : `chatbot-data.txt` (FR), `chatbot-data-ar.txt` (AR), `chatbot-data-en.txt` (EN)
- **Détection côté serveur** : Langue détectée dans l'API
- **Réponses contextuelles** : Basées sur la langue de l'input

## Structure des Fichiers

```
public/
├── chatbot-data.txt      # Données françaises
├── chatbot-data-ar.txt   # Données arabes
└── chatbot-data-en.txt   # Données anglaises

src/app/
├── api/chat/route.ts     # API avec détection de langue
├── components/Chatbot.tsx # Composant avec RTL/LTR
└── utils/languageUtils.ts # Utilitaires de langue
```

## Utilisation

### Détection Automatique
```typescript
// L'utilisateur tape en arabe
"مرحبا" → Langue détectée: 'ar' → Réponse en arabe

// L'utilisateur tape en français  
"bonjour" → Langue détectée: 'fr' → Réponse en français

// L'utilisateur tape en anglais
"hello" → Langue détectée: 'en' → Réponse en anglais
```

### Styles RTL/LTR
```typescript
// Styles appliqués automatiquement
const styles = {
  direction: language === 'ar' ? 'rtl' : 'ltr',
  textAlign: language === 'ar' ? 'right' : 'left',
  fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'
};
```

## Avantages

✅ **Expérience utilisateur optimale** : Communication naturelle  
✅ **Flexibilité maximale** : Changement de langue en temps réel  
✅ **Accessibilité** : Support complet RTL/LTR  
✅ **Expansion facile** : Ajout d'autres langues simplifié  
✅ **Standards internationaux** : Suit les meilleures pratiques  

## Exemples d'Usage

### Conversation Française
```
Utilisateur: "Bonjour, qu'est-ce qu'AIDAKI ?"
Bot: "Bonjour ! AIDAKI est une plateforme éducative moderne..."
```

### Conversation Arabe
```
المستخدم: "مرحبا، ما هو أيداكي؟"
البوت: "مرحباً! أيداكي منصة تعليمية حديثة..."
```

### Conversation Anglaise
```
User: "Hello, what is AIDAKI?"
Bot: "Hello! AIDAKI is a modern educational platform..."
```

### Changement de Langue
```
Utilisateur: "Bonjour"
Bot: "Bonjour ! Je suis l'assistant AIDAKI..."

Utilisateur: "مرحبا" 
Bot: "مرحباً! أنا مساعد أيداكي..."

Utilisateur: "Hello"
Bot: "Hello! I'm the AIDAKI assistant..."
```

## Configuration

### Variables d'Environnement
Aucune configuration supplémentaire requise.

### Personnalisation
Les messages peuvent être personnalisés dans `languageUtils.ts` :

```typescript
export const LanguageUtils = {
  getWelcomeMessage: (language: 'fr' | 'ar' | 'en') => {
    switch (language) {
      case 'ar':
        return "رسالة ترحيب مخصصة";
      case 'en':
        return "Custom welcome message";
      default:
        return "Message de bienvenue personnalisé";
    }
  }
};
```

## Support Technique

Pour toute question ou problème :
- Vérifier les fichiers de données (`chatbot-data*.txt`)
- Contrôler la détection de langue dans l'API
- Vérifier les styles RTL/LTR dans le composant

---

**Développé avec ❤️ pour AIDAKI** 🚀
