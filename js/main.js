let restaurants, neighborhoods, cuisines;
var newMap;
var markers = [];

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
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      self.fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = mapHelper();
  updateRestaurants();
};

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
updateRestaurants = () => {
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
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const el = document.getElementById('restaurants-list');
  el.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const el = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    el.append(createRestaurantHTML(restaurant));
  });
  el.append(createFlexSpacer());
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const el = document.createElement('div');
/*
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  el.append(image);
*/
  
  const picture = document.createElement('picture');
  const image = document.createElement('img');
    picture.className = 'restaurant-img';
    
    const sourceLarge = document.createElement('source');
    sourceLarge.setAttribute('media', '(min-width: 750px)');
    sourceLarge.setAttribute('srcset', DBHelper.imageUrlForRestaurantLarge(restaurant));
    picture.append(sourceLarge)
    
    const sourceMedium = document.createElement('source');
    sourceMedium.setAttribute('media', '(min-width: 500px)');
    sourceMedium.setAttribute('srcset',  DBHelper.imageUrlForRestaurantMedium(restaurant));
    picture.append(sourceMedium)
    
    image.src = DBHelper.imageUrlForRestaurant(restaurant); //default
  
    picture.append(image);
  el.append(picture);


  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  el.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  el.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  el.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  el.append(more);

  return el;
};

/** 
 * Flex has issues with the last item when growth is set to 1
 * So we insert a dummy div wuth flex-growth set to a ridicoulous number 
 * to keep the formatting somewhat right when the number of items in the 
 * last row is less than the mumber of items in the previous rows
 * This will make the dummy div expand tofill the space.
 * Then wi hide it with visibility: hidden 
 * */ 
createFlexSpacer = () => {
  const el = document.createElement('div');
  el.className = 'spacer';
  return el;
};

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

};

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

