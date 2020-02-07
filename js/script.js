// DOM nodes
const article = document.querySelector('.content__article');
const button = document.querySelector('.btn');
const content = document.querySelector('.content');
const img = document.querySelector('.content__img');
const loader = document.querySelector('.loader');

// Endpoints and error handler
const dogAPI = 'https://dog.ceo/api/breeds/image/random';
const wikiAPI = 'https://en.wikipedia.org/w/api.php';

const handleError = (err) => {
  article.textContent = `Oops. No dogs available right now because ${err}. Try again!`
}

// Loader toggles
const showLoader = () => {
  content.style.display = 'none';
  loader.style.visibility = 'visible';
}

const hideLoader = () => {
  loader.style.visibility = 'hidden';
  content.style.display = 'flex';
}

// Query the Dog API
async function getDogs(api) {
  try {
    // Get data
    let response = await fetch(api);
    let data = await response.json();
    
    // Get image
    let path = data.message;
    img.src = path;

    // Get breed
    // Break down the response to extract the breed name
    let pathArr = path.split('/');
    let breedIndex = pathArr[4];
    // Replace any dashes in the breed name with a space
    let breed = breedIndex.replace('-', '%20');

    // Build query for Wikipedia API
    let query = `${wikiAPI}?action=query&list=search&srsearch=${breed}%20dog&format=json&origin=*`

    return query;
  } catch(err) {
    handleError(err);
  }
}

// Query the Wikipedia API
async function getFacts(query) {
  try {
    let response = await fetch(query);
    let data = await response.json();
    
    // Get snippet - make sure we're not looking for it too early
    let snippet = await data.query.search[0].snippet;
      // Not ideal to use innerHTML, but should be OK 
      // because it only returns text content.
      // Faster than using a regex and accounts for escaped characters
      const div = document.createElement('div');
      div.innerHTML = snippet;
      const cleanSnippet = div.textContent;
      const firstSentence = `${cleanSnippet.substring(0, cleanSnippet.indexOf('.'))}.`;

      // Reduces garbage output
      if (firstSentence[0] !== firstSentence[0].toLowerCase() && firstSentence.length > 20) {
        article.textContent = firstSentence;
      } else {
        article.textContent = 'What kind of dog is that? A good one!';
      }

      // Wait to hide loader - Dog API isn't the fastest at serving images
      await new Promise((resolve, reject) => setTimeout(resolve, 750));

      hideLoader();

  } catch(err) {
    handleError(err);
  }
}

// Fetch those dogs!
button.addEventListener('click', () => {
  showLoader();
  getDogs(dogAPI)
    .then(query => getFacts(query))
});