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
const wikiAPI = 'https://en.wikipedia.org/w/api.php?action=query';

// Toggle loader and prevent multiple requests
const showLoader = () => {
  btn.disabled = true;
  content.style.display = 'none';
  loader.style.display = 'block';
};

const hideLoader = () => {
  btn.disabled = false;
  loader.style.display = 'none';
  content.style.display = 'block';
};

/** Query the Dog API
 * @param {string} api
 */
async function getDogs(api) {
  try {
    // Clear previous image
    img.src = '';

    // Get data
    const response = await fetch(api);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    // Get image path
    const path = data.message;

    // Handles edge cases where plott hound serves txt
    // and german shepherd returns article about Doane Pet Care
    if (!path.includes('.txt') && !path.includes('germanshepherd')) {
      img.src = path;
    } else {
      throw new Error('invalid dog');
    }

    // Break down the response to extract the breed name
    const pathArr = path.split('/');
    const breedIndex = pathArr[4];
    // Replace any dashes in the breed name with a space
    const breed = breedIndex.replace('-', '%20');

    // Build query for Wikipedia API
    const query =
    `${wikiAPI}&list=search&srsearch=${breed}%20dog&format=json&origin=*`;
    return query;
  } catch (err) {
    // Show dog emoji if Dog API call fails
    img.src = './img/dog.png';
    img.alt = 'Dog emoji';
    hideLoader();
  }
}

/** Query the Wikipedia API
 * @param {string} query
 */
async function getFacts(query) {
  // Get data
  try {
    const response = await fetch(query);
    const data = await response.json();

    if (data.query.search.length === 0) {
      throw new Error('no results');
    }

    // Get page title
    const pageTitle = data.query.search[0].title;

    // Remove anything in brackets e.g. disambiguation
    const cleanTitle = () => {
      if (pageTitle.includes('(')) {
        return pageTitle.substring('0', pageTitle.indexOf('('));
      } else {
        return pageTitle;
      }
    };

    // Set title and image alt text
    title.textContent = cleanTitle();
    img.alt = cleanTitle();

    // Get page link
    const pageID = data.query.search[0].pageid;
    link.style.display = 'block';
    link.href = `https://en.wikipedia.org?curid=${pageID}`;

    // Get snippet
    const snippet = data.query.search[0].snippet;

    // Scrub the markup to get text
    const scrubHTML = snippet.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, '');
    const escQuotes = scrubHTML.replace(/&quot;/ig, '"');

    // Get the first sentence of the snippet
    const firstSentence = `${escQuotes.substring(0, escQuotes.indexOf('.'))}.`;

    // Reduce garbage output
    // These breeds have oddly punctuated/inaccurate/weird snippets
    const edgeCases =
    ['Akita', 'Bernard', 'Chihuahua', 'Keeshond',
      'Jack', 'Leonberg', 'Malinois', 'mixed',
      'Old English Bulldog', 'Siberian'];

    // Check if sentence contains any of the edge cases
    const isEdgeCase = edgeCases.some((c) => firstSentence.includes(c));

    // Some snippets seem to start mid-sentence
    const hasCaps = firstSentence[0] !== firstSentence[0].toLowerCase();

    // 20 char limit catches junk snippets
    if (!isEdgeCase && hasCaps && firstSentence.length > 20) {
      article.textContent = firstSentence;
    } else {
      // We can keep the title if the snippet is invalid
      article.textContent = 'That\'s a great dog!!';
    }

    // Wait to hide loader - Dog API isn't the fastest at serving images
    await new Promise((resolve, reject) => setTimeout(resolve, 750));
    hideLoader();
  } catch (err) {
    // Set generic content if no results
    article.textContent = 'That\'s a great dog!!';
    title.textContent = 'Cool Dog';
    hideLoader();
  } finally {
    return;
  }
}

// Fetch those dogs!
btn.addEventListener('click', () => {
  showLoader();
  getDogs(dogAPI)
      .then((query) => getFacts(query));
});
