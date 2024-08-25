let map; // Variável global para armazenar a instância do mapa

function nextStep(stepId) {
    console.log('Avançando para o passo: ' + stepId); // Debug
    const currentCard = document.querySelector('.card.show');
    if (currentCard) {
        currentCard.classList.remove('show');
        currentCard.style.display = 'none';
    }

    const nextCard = document.getElementById(stepId);
    if (nextCard) {
        nextCard.classList.add('show');
        nextCard.style.display = 'block';
    }

    if (stepId === 'final') {
        showSummary();
    }
}

function startCamera() {
    const video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);

    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        video.srcObject = stream;
        video.play();
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0);
            const photo = canvas.toDataURL('image/png');
            document.getElementById('photo').src = photo;
            document.getElementById('cameraOutput').style.display = 'block';
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(video);
            nextStep('step5');
        }, 3000); // Captura a imagem após 3 segundos
    }).catch(error => {
        console.error('Erro ao acessar a câmera: ', error);
        alert('Não foi possível acessar a câmera.');
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                document.getElementById('location').textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
                document.getElementById('locationOutput').style.display = 'block';
                initMap(latitude, longitude);
                nextStep('final');
            },
            (error) => {
                handleLocationError(error);
                nextStep('final');
            }
        );
    } else {
        document.getElementById('location').textContent = 'Geolocalização não é suportada por este navegador.';
        document.getElementById('locationOutput').style.display = 'block';
        nextStep('final');
    }
}

function handleLocationError(error) {
    let errorMessage;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Usuário negou a solicitação de Geolocalização.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Informações de localização não estão disponíveis.";
            break;
        case error.TIMEOUT:
            errorMessage = "A solicitação de localização expirou.";
            break;
        default:
            errorMessage = "Erro desconhecido.";
    }
    document.getElementById('location').textContent = `Erro: ${errorMessage}`;
    document.getElementById('locationOutput').style.display = 'block';
}

function initMap(lat, lng) {
    if (map) { 
        map.remove(); 
    }

    map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup('Você está aqui!')
        .openPopup();
}

function showSummary() {
    const color = document.getElementById('color').value || 'Não informado';
    const food = document.getElementById('food').value || 'Não informado';
    const pet = document.getElementById('pet').value || 'Não informado';

    const summaryList = document.getElementById('dataSummary');
    summaryList.innerHTML = `
        <li><strong>Cor Favorita:</strong> ${color}</li>
        <li><strong>Comida Preferida:</strong> ${food}</li>
        <li><strong>Nome do Primeiro Animal de Estimação:</strong> ${pet}</li>
        <li><strong>Acesso à Câmera:</strong> Permitido</li>
        <li><strong>Acesso à Localização:</strong> Permitido</li>`;
}

function restart() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('show');
        card.style.display = 'none';
    });

    document.getElementById('welcome').classList.add('show');
    document.getElementById('welcome').style.display = 'block';

    document.getElementById('color').value = '';
    document.getElementById('food').value = '';
    document.getElementById('pet').value = '';

    document.getElementById('cameraOutput').style.display = 'none';
    document.getElementById('locationOutput').style.display = 'none';

    if (map) {
        map.remove();
        map = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('welcome').classList.add('show');
    document.getElementById('welcome').style.display = 'block';
});
