# 📧 Configuration EmailJS pour AIDAKI

## 🚀 Guide de Configuration Complet

### **Étape 1 : Créer le compte EmailJS**

1. **Allez sur** [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Cliquez** sur "Sign Up" 
3. **Créez** votre compte avec votre email `rayanboukabous74@gmail.com`

### **Étape 2 : Configurer le Service Email**

1. **Dans le dashboard**, allez dans "Email Services"
2. **Cliquez** sur "Add New Service"
3. **Sélectionnez** "Gmail" 
4. **Configurez** :
   - **Service Name** : `aidaki-complaints`
   - **Gmail Account** : `rayanboukabous74@gmail.com`

### **Étape 3 : Créer le Template Email**

1. **Allez** dans "Email Templates"
2. **Cliquez** sur "Create New Template"
3. **Configurez** le template :

**Template ID** : `template_complaint`

**Subject** : `Nouvelle Réclamation AIDAKI - {{category}}`

**Content** :
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouvelle Réclamation AIDAKI</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">🚨 Nouvelle Réclamation AIDAKI</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #667eea; margin-top: 0;">📋 Informations du Client</h2>
            <p><strong>Nom :</strong> {{from_name}}</p>
            <p><strong>Email :</strong> {{from_email}}</p>
            <p><strong>Téléphone :</strong> {{phone}}</p>
            <p><strong>Langue :</strong> {{language}}</p>
            <p><strong>Date :</strong> {{timestamp}}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #856404; margin-top: 0;">⚠️ Détails de la Réclamation</h2>
            <p><strong>Type de problème :</strong> {{category}}</p>
            <p><strong>Détails :</strong> {{subcategory}}</p>
        </div>
        
        <div style="background: #d1ecf1; padding: 20px; border-radius: 10px;">
            <h2 style="color: #0c5460; margin-top: 0;">💬 Message du Client</h2>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">
                {{message}}
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
            <p style="margin: 0; color: #6c757d;">
                <strong>AIDAKI Support Team</strong><br>
                Réponse requise dans les 24h
            </p>
        </div>
    </div>
</body>
</html>
```

### **Étape 4 : Obtenir les Clés**

1. **Dans le dashboard**, allez dans "Account" → "General"
2. **Copiez** votre **Public Key** (User ID)

### **Étape 5 : Mettre à jour la configuration** ✅

1. **Ouvrez** le fichier `src/config/emailjs.ts`
2. **Remplacez** `"YOUR_PUBLIC_KEY_HERE"` par votre vraie clé publique
3. **Sauvegardez** le fichier

**✅ CONFIGURÉ** : Votre clé publique `wrwKmIvDZ_vJ7h4TN` est déjà configurée !

### **Étape 6 : Tester le formulaire**

1. **Lancez** votre application : `npm run dev`
2. **Allez** sur `http://localhost:3000/ar/support-and-assistance`
3. **Cliquez** sur "Réclamations - AIDAKI"
4. **Remplissez** le formulaire de test
5. **Soumettez** et vérifiez votre email !

## ✅ **Variables du Template**

Le template utilise ces variables :
- `{{from_name}}` - Nom de l'utilisateur
- `{{from_email}}` - Email de l'utilisateur  
- `{{phone}}` - Téléphone de l'utilisateur
- `{{category}}` - Type de problème (Technique/Pédagogique)
- `{{subcategory}}` - Détails spécifiques du problème
- `{{message}}` - Message détaillé de l'utilisateur
- `{{language}}` - Langue de l'interface (ar/fr/en)
- `{{timestamp}}` - Date et heure de la réclamation

## 🎯 **Résultat Attendu**

Après configuration, vous recevrez des emails professionnels à `rayanboukabous74@gmail.com` avec :
- ✅ Design professionnel et lisible
- ✅ Toutes les informations du client
- ✅ Détails de la réclamation
- ✅ Message complet de l'utilisateur
- ✅ Timestamp et langue utilisée

## 🆘 **Support**

Si vous rencontrez des problèmes :
1. **Vérifiez** que votre clé publique est correcte
2. **Assurez-vous** que le service Gmail est bien configuré
3. **Testez** avec un email simple d'abord
4. **Consultez** les logs EmailJS dans le dashboard
