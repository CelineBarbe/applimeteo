import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

const CLEFAPI = '502bb5578bc8df2468a9394712df038c';
let resultatsAPI;

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temps');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');


if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long, lat);
    }, () => {
        alert(`Vous avez refusé la géolocalisation, l'application ne peux pas fonctionner, veuillez l'activer!`)
    })
}

function AppelAPI(long, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        resultatsAPI = data;
        temps.innerText = resultatsAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°C`;
        localisation.innerText = resultatsAPI.timezone;

        //les heures avec leur température
        let heureActuelle = new Date().getHours();

        for (let i = 0; i < heure.length; i++) {
            let heureIncr = heureActuelle + i * 3;

            if(heureIncr > 24) {
                heure[i].innerText = `${heureIncr - 24} h`
            } else if(heureIncr === 24) {
                heure[i].innerText = "0 h"
            } else {
              heure[i].innerText = `${heureIncr} h`;  
            }
        }

        for (let j = 0; j < tempPourH.length; j ++) {
            tempPourH[j].innerText = `${Math.round(resultatsAPI.hourly[j * 3].temp)}°C`;
        }

        //afficher les trois premières lettres des jours
        for (let k = 0; k < tabJoursEnOrdre.length; k ++) {
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0, 3);
        }
        
        //températures par jour
        for (let m = 0; m < 7; m ++) {
            tempJoursDiv[m].innerText = `${Math.round(resultatsAPI.daily[m + 1].temp.day)}°C`
        }

        //icone dynamique
        if(heureActuelle >=6 && heureActuelle < 20) {
            imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
        } else {
            imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
        }

        chargementContainer.classList.add('disparition');
    })
}