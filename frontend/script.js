document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('videoFile');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const message = document.getElementById('message');

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        message.style.color = "green";
        message.innerText = "Vidéo téléversée avec succès";
    } catch (error) {
        console.error('Error uploading file:', error);
        message.style.color = "red";
        message.innerText = `Erreur lors du téléversement de la vidéo. <br> Détail de l'erreur: ${error}`;
    }
});