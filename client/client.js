console.log("If you see this you're awesome!");

const form = document.querySelector("form");
const loadingElement = document.querySelector('.loading');
const chirpsElement = document.querySelector('.chirps');
const API_URL = window.location.hostname === 'localhost' ? "http://localhost:5000/chirps" : 'https://chirp-lilac.now.sh';

loadingElement.style.display = '';

listAllChirps();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const msg = formData.get('message');

    // console.log("sending to server");

    const chirp = {
        name,
        msg
    };
    // console.log(chirp);
    form.style.display = "none";
    loadingElement.style.display = "";

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(chirp),            //turns our chirp object into a JSON type string
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdChirp => {
            console.log(createdChirp);
            form.reset();
            setTimeout(() => {
                form.style.display = "";

            }, 60000);
            // loadingElement.style.display = "none";
            listAllChirps();
        });


});

function listAllChirps() {
    chirpsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(chirps => {
            chirps.reverse();
            console.log(chirps);
            chirps.forEach(chirps => {
                const div = document.createElement('div');
                const header = document.createElement('h2');
                header.textContent = chirps.name;

                const message = document.createElement('p');
                message.textContent = chirps.msg;

                const date = document.createElement('small');
                date.textContent = chirps.created_date;

                div.appendChild(header);
                div.appendChild(message);
                div.appendChild(date);


                chirpsElement.appendChild(div);
            });
            loadingElement.style.display = "none";
        });
}