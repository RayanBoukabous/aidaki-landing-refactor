# AIDAKI Landing Page - Refactored

Une landing page moderne et ultra-responsive pour AIDAKI, développée avec Next.js 15, TypeScript, et Tailwind CSS.

## 🚀 Fonctionnalités

- **Ultra-responsive** : Optimisé pour tous les écrans (mobile, tablette, desktop)
- **Multilingue** : Support complet pour Français, Anglais, et Arabe (RTL)
- **Formulaire de réclamations** : Intégration EmailJS pour l'envoi automatique d'emails
- **Animations fluides** : Framer Motion pour des transitions élégantes
- **Design moderne** : Interface utilisateur professionnelle et attractive

## 🛠️ Technologies

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling responsive
- **next-intl** pour l'internationalisation
- **Framer Motion** pour les animations
- **EmailJS** pour l'envoi d'emails
- **Lucide React** pour les icônes

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/RayanBoukabous/aidaki-landing-refactor.git
cd aidaki-landing-refactor

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 🌐 Déploiement sur Vercel

1. **Connecter le repo** à Vercel
2. **Configurer les variables d'environnement** :
   - `EMAILJS_SERVICE_ID=service_95qbhek`
   - `EMAILJS_TEMPLATE_ID=template_complaint`
   - `EMAILJS_PUBLIC_KEY=wrwKmIvDZ_vJ7h4TN`
   - `NEXT_PUBLIC_API_URL=https://aidaki.ai/api`
   - `NEXT_PUBLIC_API_BASE_URL=https://aidaki.ai/api`

3. **Déployer** : Vercel détectera automatiquement Next.js et déploiera

## 📱 Responsivité

Le projet est optimisé pour tous les breakpoints :
- **xs (320px+)** : Très petits écrans
- **sm (640px+)** : Mobiles
- **md (768px+)** : Tablettes  
- **lg (1024px+)** : Desktop
- **xl (1280px+)** : Grands écrans

## 🌍 Internationalisation

Support complet pour :
- **Français** (fr) - Langue par défaut
- **Anglais** (en) - Traduction complète
- **Arabe** (ar) - Support RTL complet

## 📧 Formulaire de Réclamations

Le formulaire de réclamations utilise EmailJS pour envoyer automatiquement les emails à `rayanboukabous74@gmail.com` avec :
- Design professionnel et responsive
- Validation en temps réel
- Support multilingue
- Gestion des erreurs

## 🎨 Design System

- **Couleurs principales** : Vert (#10B981) et dégradés
- **Typographie** : Hiérarchie claire et lisible
- **Espacement** : Système cohérent et responsive
- **Animations** : Transitions fluides et naturelles

## 📂 Structure du Projet

```
src/
├── app/
│   ├── [locale]/          # Pages internationalisées
│   ├── api/               # Routes API
│   ├── components/        # Composants réutilisables
│   └── globals.css        # Styles globaux
├── messages/              # Fichiers de traduction
├── hooks/                 # Hooks personnalisés
├── services/              # Services API
└── utils/                 # Utilitaires
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
```

## 📄 Licence

Ce projet est propriétaire d'AIDAKI.

## 👨‍💻 Développeur

**Rayan Boukabous** - Développeur Frontend Senior
- Email: rayanboukabous74@gmail.com
- GitHub: @RayanBoukabous

---

*Développé avec ❤️ pour AIDAKI*