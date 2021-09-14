//Variables
const parksEl = document.getElementById("divParks");
const inputCity = document.getElementById("inputCity");
const buttonSearch = document.getElementById("buttonSearch");
const divNews = document.getElementById("divNews");
const distanceEl = document.getElementById("distance");
let cityName = "";
let cityState = "";
let cityLat = 0;
let cityLng = 0;

//Functions

//Get News About the City

//Get National Park List
function getNationalParks() {
  const url = `https://developer.nps.gov/api/v1/parks?limit=465V&api_key=x6sAYVvGxVvGZ5T60O2OnqEGdJnsiGuyJBeye1QX`;
  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      //show parks
      showParks(response.data);
    });
}

//Show Park closed to the City in the State
function showParks(parks) {
  if (parks) {
    parksEl.innerHTML = "";
    parks.map((park) => {
      const dist = distance(cityLat, cityLng, park.latitude, park.longitude);
      if (dist <= Number(distanceEl.value)) {
        // all images for the park
        let parkImages = `<div class="ui tiny images">`;
        for (let i = 0; i < park.images.length; i++) {
          parkImages += `<img class="ui image Mini" src="${park.images[i].url}" loading="lazy">`;
        }
        parkImages += `</div>`;

        //all activities for the park
        let parkActivities = "<span>";
        for (let i = 0; i < 5 && i < park.activities.length; i++) {
          console.log(park.activities[i].name);
          parkActivities += ` ${park.activities[i].name},`;
        }
        parkActivities += `</span>`;

        const newPark = `
        <div class="ui item">
          <div class="ui large image">
            <img class="main-image" src="${park.images[0].url}">
          </div>
          <div class="content left aligned">
            <div class="header">${park.fullName} 
              <div id="favorite" class="ui right floated">
                <i data-name="${
                  park.fullName
                }" class="bookmark outline icon"></i>
              </div>
            </div>
              <div class="meta">
                <span> ${park.addresses[0].line1}, ${park.addresses[0].city} ${
          park.addresses[0].stateCode
        } <br>${Math.floor(dist)} miles away</span>
              </div>
              <div class="description">
                <p>${park.description}</p>
              </div>
              <div class="extra">
                <span>${
                  park.entranceFees[0].cost === "0.00"
                    ? "Free"
                    : "$" + park.entranceFees[0].cost
                }</span>
                <span>${park.activities[0].name}, ${
          park.activities[1].name
        }</span>
              </div>
              ${parkImages}
              
          </div>
        </div>

`;
        parksEl.innerHTML += newPark;
      }
    });
  }
}

//Calculate the Distance between to poitn base in coordinates Harvesine Formula geodatasource.com
function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

//Google Autocomplete API
let autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(inputCity, {
    types: ["(cities)"],
    componentRestrictions: {
      country: "us",
    },
  });
  autocomplete.addListener("place_changed", onCityChanged);
}
//Get City Weather Information
function onCityChanged() {
  var place = autocomplete.getPlace();
  console.log("place from Google API", place);
  cityLat = place.geometry.location.lat();
  cityLng = place.geometry.location.lng();
  cityName = place.vicinity;
  cityState = place.address_components[2].short_name;

  getNationalParks();
}

distanceEl.addEventListener("blur", () => {
  if (distanceEl.value && distanceEl.value != "0") {
    getNationalParks();
  } else {
    $("#modalDistance").modal("show");
  }
});

parksEl.addEventListener("click", (event) => {
  const parkName = event.target.getAttribute("data-name");
  console.log(parkName);
});
