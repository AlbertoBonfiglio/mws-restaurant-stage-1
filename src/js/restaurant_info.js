let restaurant;

var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = mapHelper([restaurant.latlng.lat, restaurant.latlng.lng], 16);

      fillBreadcrumb();
      
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
};  
 

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      // gets the reviews if any
      DBHelper.fetchRestaurantReviewsById(id, (error, reviews) => {
        self.restaurant.reviews = reviews;
        if (!reviews) {
          console.log('NO reviews found');
        }
        if (error) {
          console.error(error);
          return;
        }

        fillRestaurantHTML();
        callback(null, restaurant);
      });

    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  
  const picture = document.getElementById('restaurant-img');
  picture.className = 'restaurant-img';  
    const image = document.createElement('img');
    const sourceLarge = document.createElement('source');
    sourceLarge.setAttribute('media', '(min-width: 750px)');
    sourceLarge.setAttribute('srcset', DBHelper.imageUrlForRestaurantLarge(restaurant));
    picture.append(sourceLarge)
    
    const sourceMedium = document.createElement('source');
    sourceMedium.setAttribute('media', '(min-width: 500px)');
    sourceMedium.setAttribute('srcset',  DBHelper.imageUrlForRestaurantMedium(restaurant));
    picture.append(sourceMedium)
    
    image.src = DBHelper.imageUrlForRestaurant(restaurant); //default
    image.setAttribute('alt', `${restaurant.name}'s ${restaurant.photographAlt} `);
    
    picture.append(image);  


  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  // now repopulate
  const header = document.createElement('div');
  header.setAttribute('class', 'header');
    const title = document.createElement('div');
    title.setAttribute('class', 'title');
      const h3 = document.createElement('h3');
      h3.innerHTML = 'Reviews';
    title.appendChild(h3);
    header.appendChild(title);

    const button = document.createElement('div');
      button.setAttribute('class', 'details');
        const btn = document.createElement('a');
        btn.innerHTML = 'Add Review';
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', 'view details');
        btn.onclick = function() { showModal(); };
      button.appendChild(btn);
  
    header.appendChild(button);
      
  container.appendChild(header);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

showModal = () => {
  let rest = document.getElementById('restaurant_id');
  rest.value = self.restaurant.id;
  let modal = document.getElementById('reviews-modal');
  modal.style.display = 'block';
};


closeModal = () => {
  let modal = document.getElementById('reviews-modal');
  modal.style.display = 'none';
};

submitModal= (event, form ) => {
  event.preventDefault();
  let formData = new FormData(document.getElementById('modal-form'));
  let review = {};
  formData.forEach((value, key) => {review[key] = value;});
  
  DBHelper.addRestaurantReview(JSON.stringify(review), (error, data) => {
    if (error) { // Got an error
      console.error(error);
      window.alert('You appear to be offline. Your review will be submitted as soon as you are back online.');
      closeModal();
    }
    if (data){
      closeModal();
      const ul = document.getElementById('reviews-list');
      ul.appendChild(createReviewHTML(data));
    }});
  };


  checkform = () => {
    var validInputs = ['text', 'textarea'];
    var f = document.forms['modal-form'].elements;
    var cansubmit = true;

    for (var i = 0; i < f.length; i++) {
      if (validInputs.includes(f[i].type)) { // only checks the needed inputs
        if (f[i].value.length === 0) {
          cansubmit = false;
          break;
        }
      }
    }
    console.log('cansubmit ', cansubmit);
    document.getElementById('button_submit').disabled = !cansubmit;
  };

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date(review.updatedAt);
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
