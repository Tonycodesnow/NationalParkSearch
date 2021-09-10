//Variables
const parksEl = document.getElementById("divParks");
const inputCity = document.getElementById("inputCity");
const buttonSearch = document.getElementById("buttonSearch");
const divNews = document.getElementById("divNews");
let cityName = "";
let cityState = "";
let cityLat = 0;
let cityLng = 0;

//Fucntions

//TODO: Create a function for get Population Information API

//TODO: Create a function for get Weather from the City or Coordinates

//Get News About the City
function getCityNews(city) {
  const today = moment();

  const myHeaders = new Headers();
  myHeaders.append("X-Api-Key", "a75bb4ec9843405194050dbd7e770d3f");
  const urlNews = `https://newsapi.org/v2/everything?q=${city}&from=${today.format(
    "YYYY-MM-DD"
  )}&sortBy=publishedAt`;

  fetch(urlNews, {
    headers: {
      "X-Api-Key": "a75bb4ec9843405194050dbd7e770d3f",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //shows news
      showNews(data.articles);
    });
}

//TODO: Get National Park List
function getNationalParks(state) {
  const url = `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=x6sAYVvGxVvGZ5T60O2OnqEGdJnsiGuyJBeye1QX`;
  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      //show parks
      showPaks(response.data);
    });
}

//Create function for showNews
function showNews(news) {
  divNews.innerHTML = "";
  if (news) {
    for (let n of news) {
      const publishedDate = moment(n.publishedAt);
      const newContent = `
           <a class="card" href="${n.url}" target="_blank">
              <div class="image">
                <img src="${n.urlToImage}" />
              </div>
              <div class="content">
                <div class="header">${n.title}</div>
                <div class="description">
                  ${n.description}
                </div>
              </div>
              <div class="extra content">
                <span class="right floated">${publishedDate.format(
                  "MM/DD/YYYY"
                )}</span>
                <span>
                  ${n.author}
                </span>
              </div>
            </a>`;
      divNews.innerHTML += newContent;
    }
  }
}

//TODO:Show Park closed to the City in the State
function showPaks(parks) {
  if (parks) {
    parksEl.innerHTML = ""
    parks.map((park) => {
      
      const dist = distance(cityLat, cityLng, park.latitude, park.longitude);
      if (dist <= 150) {
        console.log(park.images[0])
        const newPark = `<div class="card">
        <div class="blurring dimmable image">
          <div class="ui dimmer">
            <div class="content">
              <div class="center">
                <div class="ui inverted button">Go to Park Site</div>
              </div>
            </div>
          </div>
          <img class=“medium ui image” src="${park.images[0].url}">
        </div>
        <div class="content">
          <a class="header">${park.fullName}</a>
          <div class="meta">
            <span class="date">${Math.floor(dist)} miles</span>
          </div>
        </div>
        <div class="extra content">
          <a>
          <i class=“calendar outline icon”></i>
              ${park.activities[0].name}, ${park.activities[1].name}
          </a>
        </div>
      </div>`
        parksEl.innerHTML += newPark
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

//Event Listeners
buttonSearch.addEventListener("click", (event) => {
  console.log("button Search Click");
  getCityNews(cityName);
});

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
  getCityNews(cityName);
  getNationalParks(cityState);
}
