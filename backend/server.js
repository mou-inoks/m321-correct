/**
 * Service web statique + d'API pour le téléversement de vidéo
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Instantiation du serveur web express
const app = express();
const port = 3000;

// Pour servir le contenu statique
app.use(express.static('public'));

// Configuration de la librairie multer pour la destination et le nommage des fichiers lors du téléversement
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads';

        // Si le dossier de destination n'existe pas déjà, il est créé
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        /* On sauvegarde avec comme nom de fichier l'horodatage + l'extension de fichier
           pour éviter des erreurs si l'utilisateur téléverse à plusieurs reprises le même fichier
        */
        cb(null, Date.now() + path.extname(file.originalname));
    },
});




// Instantiation de la librairie multer pour le stockage
const upload = multer({ storage });

// Définition de la route pour le téléversement
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Le fichier à téléverser est manquant" });
    }

    // Respond with the uploaded file information
    res.json({ fileName: "La vidéo a été téléversée avec succès." });

    
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
