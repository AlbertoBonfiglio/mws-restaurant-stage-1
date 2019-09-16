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
  addMarkersToMap();
};


/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const el = document.createElement('div');
  el.setAttribute('class', 'restaurant-container')
  const picture = document.createElement('picture');
  const image = document.createElement('img');
    picture.className = 'restaurant-img';
    
    const sourceLarge = document.createElement('source');
    sourceLarge.setAttribute('media', '(min-width: 750px)');
    sourceLarge.setAttribute('srcset', DBHelper.imageUrlForRestaurantLarge(restaurant));
    picture.append(sourceLarge);
    
    const sourceMedium = document.createElement('source');
    sourceMedium.setAttribute('media', '(min-width: 500px)');
    sourceMedium.setAttribute('srcset',  DBHelper.imageUrlForRestaurantMedium(restaurant));
    picture.append(sourceMedium);
    
    image.src = DBHelper.imageUrlForRestaurant(restaurant); //default
    image.setAttribute('alt', `${restaurant.name}'s ${restaurant.photographAlt} `);
    picture.append(image);
  el.append(picture);


  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  el.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  el.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  el.append(address);
  
  // creates an actionbar to store the detail button and the favourite toggle
  const actionbar = document.createElement('div');
  actionbar.setAttribute('class', 'actionbar');
    const favourite = document.createElement('div');
    favourite.onclick = function(){ toggleFavourite(event, restaurant); };
    favourite.setAttribute('class', 'checkbox');
      const heart = createHeartSVG(restaurant.id, restaurant.is_favorite);
      heart.onclick = function(){ toggleFavourite(event, restaurant); };
    favourite.append(heart)  ;
  actionbar.append(favourite);
  
    //wraps the details button in a div
    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'details');
      const more = document.createElement('a');
      more.innerHTML = 'View Details';
      more.href = DBHelper.urlForRestaurant(restaurant);
      more.setAttribute('role', 'button');
      more.setAttribute('aria-label', 'view details');
    buttonDiv.append(more);
  actionbar.append(buttonDiv);

  el.append(actionbar);

  return el;
};

/** 
 * Toggle Favourite Restaurant 
 */
toggleFavourite = (event, restaurant) => {
  event.stopPropagation();
  restaurant.is_favorite = !restaurant.is_favorite;
  
  DBHelper.updateRestaurant((error, restaurant) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      let _hrt = document.getElementById(`favourite-hrt-path-${restaurant.id}`);
      _hrt.style.fill = restaurant.is_favorite ? 'orange': 'grey';
    }
  }, restaurant);
 
};

/** Create the Heart SVG
 * 
 */
createHeartSVG = (id, status) => {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('id', `favourite-hrt-${id}`);
  svg.setAttribute('alt', `Mark as favourite restaurant`);
  svg.setAttribute('aria-label', `Mark as favourite restaurant`);
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute('viewbox', '0 0 24 24');
  svg.setAttribute('width', '24px');
  svg.setAttribute('height', '24px');

  let path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  path1.setAttribute('id', `favourite-hrt-path-${id}`);
  path1.setAttribute('d', 'M12 4.419c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z');
  //path1.setAttribute('fill', status ? 'orange': 'grey');
  path1.setAttribute('style', `fill: ${status ? 'orange': 'grey'}`);
  
  svg.appendChild(path1);
  return svg;
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

