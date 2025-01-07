document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('videoFile');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Target des elements html a remplir
    const message = document.getElementById('message');
    const instruction = document.getElementById('instruction');
    const urlFile = document.getElementById('urlFile');
    const url480 = document.getElementById('url480');
    const url720 = document.getElementById('url720');

    // Url de POST pour notre API
    const postURL = "http://api.stream.cfpt.info/api/upload";
    // Url des fichiers uploader
    const uploadsUrl = "http://api.stream.cfpt.info/uploads/"

    try {
        const response = await fetch(postURL, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        
        // Retrait du .mp4 dans le nom du fichier
        const fileNameWithoutMp4 = result.fileName.slice(0, -4)

        // Contenu à afficher sur la page
        message.style.color = "green";
        message.innerText = "Vidéo téléversée avec succès";
        instruction.innerText = "Vos médias sont dans une file d'attente et seront disponible aux url's suivante : "
        urlFile.innerText = `Vidéo format standard : ${uploadsUrl}${result.fileName}`
        url480.innerText = `Vidéo format 480p : ${uploadsUrl}${fileNameWithoutMp4}-480.mp4`
        url720.innerText = `Vidéo format 720p : ${uploadsUrl}${fileNameWithoutMp4}-720.mp4`
        
    } catch (error) {
        console.error('Error uploading file:', error);
        message.style.color = "red";
        message.innerText = `Erreur lors du téléversement de la vidéo. <br> Détail de l'erreur: ${error}`;
    }
});