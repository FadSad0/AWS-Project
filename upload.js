document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const resultDiv = document.getElementById('result');
    const fileName = document.getElementById('file-name');
    const loadingModal = document.getElementById('loading-modal');
    const progressBar = document.querySelector('.progress');

    fileInput.addEventListener('change', function() {
        fileName.innerText = fileInput.files[0] ? fileInput.files[0].name : 'No file selected';
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            resultDiv.innerText = 'Please select a file.';
            return;
        }

        // Show loading modal
        loadingModal.classList.add('is-active');
        progressBar.value = 0;

        const response = await fetch('https://98cpf0zs31.execute-api.us-east-1.amazonaws.com/default/website', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName: file.name, fileType: file.type })
        });

        if (response.ok) {
            const data = await response.json();
            const presignedUrl = data.presignedUrl;

            const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                body: file
            });

            if (uploadResponse.ok) {
                resultDiv.innerText = 'Upload successful!';
                resultDiv.classList.add('is-success');
                resultDiv.style.display = 'block';
            } else {
                resultDiv.innerText = 'Upload failed.';
                resultDiv.classList.add('is-danger');
                resultDiv.style.display = 'block';
            }
        } else {
            resultDiv.innerText = 'Request failed.';
            resultDiv.classList.add('is-danger');
            resultDiv.style.display = 'block';
        }

        // Hide loading modal
        loadingModal.classList.remove('is-active');
    });
});
