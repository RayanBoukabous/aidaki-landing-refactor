# Instructions pour mettre à jour Nginx - Fix Chatbot

## 🎯 Problème
Le chatbot ne fonctionne pas en production car nginx redirige `/api/chat` vers le backend au lieu de Next.js.

## ✅ Solution
Ajouter une règle spécifique pour `/api/chat` dans la configuration nginx **AVANT** la règle générale `/api`.

---

## 📋 Étapes à suivre sur le serveur

### 1. Se connecter au serveur
```bash
ssh user@test.aidaki.ai
# ou selon votre méthode de connexion
```

### 2. Trouver le fichier de configuration nginx

**Option A : Si nginx est dans Docker**
```bash
# Trouver le conteneur nginx
docker ps | grep nginx

# Voir où est monté le fichier de config
docker inspect <nom-conteneur-nginx> | grep -A 10 Mounts
```

**Option B : Si nginx est installé directement**
```bash
# Trouver le fichier de config principal
nginx -T 2>/dev/null | grep "configuration file" | head -1

# Ou chercher les fichiers de config
ls -la /etc/nginx/
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/conf.d/
```

### 3. Éditer le fichier de configuration

**Important :** Faire une sauvegarde d'abord !
```bash
# Sauvegarder
cp /chemin/vers/nginx.conf /chemin/vers/nginx.conf.backup
```

### 4. Ajouter la règle `/api/chat`

Ouvrir le fichier de config et trouver la section qui contient :
```nginx
location / {
    proxy_pass http://aidaki-dashboard:3000;
    ...
}

# Backend API
location /api {
    proxy_pass http://aidaki-backend:5000/api;
    ...
}
```

**Ajouter cette règle ENTRE les deux** (après `location /` et avant `location /api`) :

⚠️ **IMPORTANT : Choisir la bonne URL selon votre architecture :**

**Option 1 : Si nginx et Next.js sont dans le MÊME réseau Docker**
```nginx
# Next.js API routes (chatbot) - MUST be before /api rule
location /api/chat {
    proxy_pass http://aidaki-dashboard:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Option 2 : Si nginx est sur le serveur mais Next.js est dans Docker (port exposé)**
```nginx
# Next.js API routes (chatbot) - MUST be before /api rule
location /api/chat {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Option 3 : Si tout est sur le serveur (pas de Docker)**
```nginx
# Next.js API routes (chatbot) - MUST be before /api rule
location /api/chat {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**💡 Comment savoir quelle option utiliser ?**
- Regardez la règle `location /` existante dans votre config nginx
- Utilisez la MÊME URL que celle utilisée pour `location /`
- Si c'est `http://aidaki-dashboard:3000` → Option 1
- Si c'est `http://localhost:3000` → Option 2
- Si c'est `http://127.0.0.1:3000` → Option 3

**Résultat final (exemple avec Option 1 - Docker) :**
```nginx
location / {
    proxy_pass http://aidaki-dashboard:3000;  # ⚠️ Utiliser la MÊME URL pour /api/chat
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Next.js API routes (chatbot) - MUST be before /api rule
location /api/chat {
    proxy_pass http://aidaki-dashboard:3000;  # ⚠️ MÊME URL que location /
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Backend API
location /api {
    proxy_pass http://aidaki-backend:5000/api;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**⚠️ RÈGLE D'OR :** La règle `/api/chat` doit utiliser **exactement la même URL** que la règle `location /` existante !

### 5. Tester la configuration

**Si nginx est dans Docker :**
```bash
docker exec <nom-conteneur-nginx> nginx -t
```

**Si nginx est installé directement :**
```bash
nginx -t
```

Si vous voyez `syntax is ok` et `test is successful`, c'est bon ! ✅

### 6. Recharger nginx

**Si nginx est dans Docker :**
```bash
docker exec <nom-conteneur-nginx> nginx -s reload
# ou
docker restart <nom-conteneur-nginx>
```

**Si nginx est installé directement :**
```bash
nginx -s reload
# ou
systemctl reload nginx
# ou
service nginx reload
```

### 7. Tester le chatbot

1. Aller sur `https://test.aidaki.ai`
2. Ouvrir le chatbot
3. Envoyer un message (ex: "bonjour")
4. Vérifier que ça fonctionne ✅

---

## 🔍 Vérification en cas de problème

### Vérifier les logs nginx
```bash
# Si Docker
docker logs <nom-conteneur-nginx>

# Si installé directement
tail -f /var/log/nginx/error.log
```

### Tester l'API directement
```bash
curl -X POST https://test.aidaki.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"bonjour"}'
```

Devrait retourner une réponse JSON avec `response` et `language`.

---

## 📝 Notes importantes

- ⚠️ **L'ordre est crucial** : La règle `/api/chat` DOIT être avant `/api`
- 💾 **Toujours faire une sauvegarde** avant de modifier
- ✅ **Tester la config** avant de recharger
- 🔄 **Recharger nginx** après modification (pas besoin de redémarrer)

---

## 🆘 En cas d'urgence

Si nginx ne fonctionne plus après la modification :
```bash
# Restaurer la sauvegarde
cp /chemin/vers/nginx.conf.backup /chemin/vers/nginx.conf

# Recharger
nginx -s reload
# ou
docker exec <nom-conteneur-nginx> nginx -s reload
```

