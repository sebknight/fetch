// DOM nodes
const article = document.querySelector('.content__article');
const btn = document.querySelector('.btn');
const content = document.querySelector('.content');
const img = document.querySelector('.content__img');
const link = document.querySelector('.content__link');
const loader = document.querySelector('.loader');
const title = document.querySelector('.content__title');

// Endpoints
const dogAPI = 'https://dog.ceo/api/breeds/image/random';
const wikiAPI = 'https://en.wikipedia.org/w/api.php';

// Toggle loader and prevent multiple requests
const showLoader = () => {
  btn.disabled = true;
  content.style.display = 'none';
  loader.style.visibility = 'visible';
}

const hideLoader = () => {
  btn.disabled = false;
  loader.style.visibility = 'hidden';
  content.style.display = 'flex';
}

// Query the Dog API
async function getDogs(api) {
  try {
    // Clear previous image
    img.src = '';

    // Get data
    let response = await fetch(api);
    let data = await response.json();
    
    // Get image
    let path = await data;
    path = data.message;

    // Handles edge case where plott hound serves txt
    if (!path.includes('hound-plott')) {
      img.src = path;
    } else {
      throw new Error('Invalid dog');
    }

    // Break down the response to extract the breed name
    const pathArr = path.split('/');
    const breedIndex = pathArr[4];
    // Replace any dashes in the breed name with a space
    const breed = breedIndex.replace('-', '%20');

    // Build query for Wikipedia API
    let query = `${wikiAPI}?action=query&list=search&srsearch=${breed}%20dog&format=json&origin=*`

    return query;
  } catch(err) {
    // Show dog emoji if Dog API call fails
    img.src = './img/dog.png';
    hideLoader();
  }
}

// Query the Wikipedia API
async function getFacts(query) {
  try {
    // Get data
    let response = await fetch(query);
    let data = await response.json();
    console.log(data);
    
    // Get page title
    let pageTitle = await data;
    pageTitle = data.query.search[0].title;
    
    // Remove anything in brackets e.g. disambiguation
    cleanTitle = pageTitle.substring(0, pageTitle.indexOf('('));
    title.textContent = cleanTitle;

    // Get page link
    let pageID = await data;
    pageID = data.query.search[0].pageid;
    link.style.display = 'flex';
    link.href = `https://en.wikipedia.org?curid=${pageID}`;
    
    // Get snippet
    let snippet = await data;
    snippet = data.query.search[0].snippet;

    // Some breeds have no search results on Wikipedia
    if (!snippet) {
      article.textContent = 'What kind of dog is that? A good one!'
    }

    // Scrub the markup to get text
    // Not ideal to use innerHTML, but should be OK because it just returns text content
    // Faster than a regex and accounts for escaped characters
    const div = document.createElement('div');
    div.innerHTML = snippet;
    const cleanSnippet = div.textContent;

    // Get the first sentence of the snippet
    const firstSentence = `${cleanSnippet.substring(0, cleanSnippet.indexOf('.'))}.`;

    // Reduce garbage output
    // These breeds have oddly punctuated/inaccurate/weird snippets
    const edgeCases = 
    ['Akita', 'Chihuahua', 'Keeshond', 'Leonberg', 
    'Malinois', 'mixed', 'Old English Bulldog',
    'Parson', 'Siberian'];

    // Check if sentence contains any of the edge cases
    const isEdgeCase = edgeCases.some(c => firstSentence.includes(c));
    
    // Some snippets seem to start mid-sentence
    const hasCaps = firstSentence[0] !== firstSentence[0].toLowerCase();

    // 20 char limit catches junk snippets
    if (!isEdgeCase && hasCaps && firstSentence.length > 20) {
      article.textContent = firstSentence;
    } else {
      title.textContent = "A Good Dog";
      article.textContent = 'What kind of dog is that? A good one!';
    }

    // Wait to hide loader - Dog API isn't the fastest at serving images
    await new Promise((resolve, reject) => setTimeout(resolve, 750));
    hideLoader();
  } catch(err) {
    article.textContent = 'All dogs are good dogs.'
  }
}

// Fetch those dogs!
btn.addEventListener('click', () => {
  showLoader();
  getDogs(dogAPI)
    .then(query => getFacts(query))
});