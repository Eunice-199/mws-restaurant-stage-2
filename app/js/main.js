// // Register the service worker
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./sw.js').then((reg) => {

//         if (reg.waiting) {

//             //console.log("sw is skipping waiting");
//             self.skipWaiting();

//             return;
//         }


//         // Registration was successful
//         console.log('Registration Worked!', reg.scope);
//     }).catch(err => {
//         // registration failed :(
//         console.log('Registration failed!: ', err);
//     });
// }




let restaurants,
    neighborhoods,
    cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    initMap(); // added 
    fetchNeighborhoods();
    fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
}

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
}

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
}

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
}

/**
 * Initialize leaflet map, called from HTML.
 */
window.initMap = () => {
        self.newMap = L.map('map', {
            center: [40.722216, -73.987501],
            zoom: 12,
            scrollWheelZoom: false
        });
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
            mapboxToken: 'pk.eyJ1IjoiZW1penkiLCJhIjoiY2psMTNzcXE2MHB5eDN2bnFrd3N6OXYxYiJ9.EWYzgJ7ZBIh1-CH94IbzjA',
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(newMap);

        updateRestaurants();
    }
    /* window.initMap = () => {
      let loc = {
        lat: 40.722216,
        lng: -73.987501
      };
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false
      });
      updateRestaurants();
    } */

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    if (self.markers) {
        self.markers.forEach(marker => marker.remove());
    }
    self.markers = [];
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
    let tabIndex = 3;
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant, tabIndex));
        tabIndex++;
    });
    addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
// const createRestaurantHTML = (restaurant) => {
//         const li = document.createElement('li');

//         const image = document.createElement('img');
//         image.className = 'restaurant-img';
//         image.src = DBHelper.imageUrlForRestaurant(restaurant);
//         image.alt = restaurant.photo_text
//         li.append(image);

//         const name = document.createElement('h3');
//         name.innerHTML = restaurant.name;
//         li.append(name);

//         const neighborhood = document.createElement('p');
//         neighborhood.innerHTML = restaurant.neighborhood;
//         li.append(neighborhood);

//         const address = document.createElement('p');
//         address.innerHTML = restaurant.address;
//         li.append(address);

//         const more = document.createElement('a');
//         more.innerHTML = 'View Details';
//         more.href = DBHelper.urlForRestaurant(restaurant);
//         li.append(more)

//         return li
//     }





createRestaurantHTML = (restaurant) => {
    const li = document.createElement('li');
    /*
      const image = document.createElement('img');
      image.className = 'restaurant-img';
      image.src = DBHelper.imageUrlForRestaurant(restaurant);
      li.append(image);
    */

    /**
     * Create picture elements, and add source child elements to the html 
     */
    // create a picture element. This picture element will allow source tag for your image
    const picture = document.createElement('picture');
    li.append(picture);
    // Here you will specify the different images for display
    const imageSrc = DBHelper.imageUrlForRestaurant(restaurant);
    // the -large_2x.jpg should be your own image name you have
    const largeImageSrc = imageSrc.replace('.jpg', '--large_2x.jpg');
    // the -normal_1x.jpg should be your own image name you have
    const normalImageSrc = imageSrc.replace('.jpg', '--normal_1x.jpg');
    // the -small.jpg should be your own image name you have
    const smallImageSrc = imageSrc.replace('.jpg', '--small.jpg');
    // then you create two source elements
    const source1 = document.createElement('source');
    source1.setAttribute('type', 'image/jpg');
    source1.setAttribute('media', '(' + 'min-width:' + '750px' + ')');
    source1.setAttribute('srcset', largeImageSrc + ' 2x,' + normalImageSrc + ' 1x');

    const source2 = document.createElement('source');
    source1.setAttribute('type', 'image/jpg');
    source1.setAttribute('media', '(' + 'min-width:' + '320px' + ')');
    source1.setAttribute('srcset', normalImageSrc + ' 1x,' + largeImageSrc + ' 2x');

    picture.append(source1);
    picture.append(source2);
    // then you create another img element and add tag and other attributes to it
    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.src = smallImageSrc;
    // image.src = imageSrc ;
    image.setAttribute('tabindex', 0);
    image.setAttribute('alt', 'image for ' + restaurant.name + ' Restaurant');
    picture.append(image);


    const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    name.setAttribute('tabindex', 0);
    name.setAttribute('aria-label', `${restaurant.name}`);
    li.append(name);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    neighborhood.setAttribute('tabindex', 0);
    neighborhood.setAttribute('aria-label', `${restaurant.neighborhood}`);
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    address.setAttribute('tabindex', 0);
    address.setAttribute('aria-label', `${restaurant.address}`);
    li.append(address);

    const more = document.createElement('button');
    more.setAttribute('type', 'button');
    more.setAttribute('aria-label', `view details, 
      click this to visit ${name.innerHTML} 
      restaurant review page, 
      note press tab once and hit enter to visit 
      ${name.innerHTML} review page`);

    // more.setAttribute('aria-label', 'view details');
    let anchorForMore = document.createElement('a');
    // anchorForMore.setAttribute('aria-label', 'view details button');
    anchorForMore.setAttribute('aria-hidden', 'true');
    anchorForMore.innerHTML = 'View Details';
    // more.innerHTML = 'View Details';
    // more.href = DBHelper.urlForRestaurant(restaurant);
    anchorForMore.href = DBHelper.urlForRestaurant(restaurant);
    // more.href = DBHelper.urlForRestaurant(restaurant);
    // more.setAttribute("href", DBHelper.urlForRestaurant(restaurant));
    more.append(anchorForMore);
    li.append(more)

    return li
}


/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
        restaurants.forEach(restaurant => {
            // Add marker to the map
            const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
            marker.on("click", onClick);

            function onClick() {
                window.location.href = marker.options.url;
            }
            self.markers.push(marker);
        });

    }
    /* addMarkersToMap = (restaurants = self.restaurants) => {
      restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, 'click', () => {
          window.location.href = marker.url
        });
        self.markers.push(marker);
      });
    } */