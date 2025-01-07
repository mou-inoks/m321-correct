# Transcodeur de vidéos - Projet d'Examen M321

## Description

Ce projet est une application de transcodage vidéo qui permet de convertir des vidéos en plusieurs formats (par exemple, 480p, 720p, etc.). Elle est composée de plusieurs microservices (backend, frontend, transcoding) orchestrés avec Docker et Traefik comme reverse proxy.

---

## Fonctionnalités

- **Backend** : Gère les API et la logique métier.
- **Frontend** : Interface utilisateur pour interagir avec le transcodeur.
- **Transcoding** : Service qui effectue le transcodage des vidéos.
- **RabbitMQ** : Messagerie utilisée pour la communication entre services.
- **Traefik** : Reverse proxy pour la gestion des domaines et du trafic.

--- 

## Prérequis

- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/) installés.
- Accès au domaine configuré pour Traefik :
  - **Frontend** : `http://stream.cfpt.info`
  - **Backend** : `http://api.stream.cfpt.info`

---

## Volumes

```yaml
volumes:
  video-uploads:
```


Ce fichier couvre les principales fonctionnalités de votre projet et détaille la configuration Docker-Compose. Vous pouvez l'adapter si nécessaire.
