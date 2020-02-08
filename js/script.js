// DOM NODES
const article = document.querySelector('.content__article');
const btn = document.querySelector('.btn');
const content = document.querySelector('.content');
const img = document.querySelector('.content__img');
const link = document.querySelector('.content__link');
const loader = document.querySelector('.loader');
const title = document.querySelector('.content__title');

// ENDPOINTS
const dogAPI = 'https://dog.ceo/api/breeds/image/random';
const wikiAPI = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=';

// GLOBAL FUNCTIONS
// Toggle loader and prevent multiple requests
const showLoader = () => {
  btn.disabled = true;
  content.style.display = 'none';
  loader.style.display = 'block';
};

const hideLoader = () => {
  btn.disabled = false;
  img.style.display = 'block';
  content.style.display = 'flex';
  loader.style.display = 'none';
};

// Handle failures gracefully with generic content
const genArticle =
['That\'s a great dog!!', 'NICE.', 'You love to see it.', 'An angel!'];
const genTitle = ['Cool Dog', 'Great Dog', 'Nice Dog',
  'Perfect Dog', 'Rad Dog'];
// Get random generic content
const getGeneric = (gen) => {
  return gen[Math.floor(Math.random()*gen.length)];
};

// Check for edge cases, used to reduce garbage output
const isEdgeCase = (cases, str) => {
  return cases.some((c) => str.includes(c));
};

/** Query the Dog API
 * @param {string} endpoint
 */
async function getDogs(endpoint) {
  try {
    // Clear previous image
    img.src = '';

    // Get data
    // Fetch request wrapped in a timeout to avoid infinite load
    let didTimeOut = false;

    const response = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);
      fetch(endpoint)
          .then((response) => {
            clearTimeout(timeout);
            if (!didTimeOut) {
              resolve(response);
            }
          });
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    // Get image path
    const path = data.message;

    // Set image if it's valid
    // Dog API serves txt instead of img for plott hound
    // St Bernard and German Shepherd result in unrelated Wiki articles
    // Separating dog and snippet edge cases maximises available results
    // by ensuring we can see the image even if the snippet is invalid
    const dogEdgeCases = ['txt', 'plott', 'bernard', 'germanshepherd'];

    if (!isEdgeCase(dogEdgeCases, path)) {
      img.src = path;
    } else {
      throw new Error('invalid dog');
    }

    img.onerror = new Error('image failed to load');

    // Break down the response to extract the breed name
    const pathArr = path.split('/');
    const breedIndex = pathArr[4];
    // Replace any dashes in the breed name with a space
    const breed = breedIndex.replace('-', '%20');

    // Build query for Wikipedia API
    const query =
    `${wikiAPI}${breed}%20dog&format=json&origin=*`;
    return query;
  } catch (err) {
    // Show dog emoji if Dog API call fails
    img.src = './img/dog.png';
    img.alt = 'Dog emoji';
    link.style.display = 'none';
    img.onload = () =>
      hideLoader();
  }
}

/** Query the Wikipedia API
 * @param {string} query
 */
async function getFacts(query) {
  try {
    // Clear previous content
    title.textContent = '';
    article.textContent = '';

    // Get data
    const response = await fetch(query);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

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

    // Following functions reduce garbage output
    // Some snippets seem to start mid-sentence
    const hasCaps = firstSentence[0] !== firstSentence[0].toLowerCase();

    // These breeds produce oddly punctuated/weird/unrelated snippets
    const snippetEdgeCases =
      ['Affenpinscher', 'Akita', 'Chihuahua', 'Keeshond',
        'Jack', 'Leonberg', 'Merrill', 'Malinois',
        'mixed', 'Old English Bulldog', 'Siberian'];

    // 20 chars is a good limit to avoid junk strings
    if (!isEdgeCase(snippetEdgeCases, firstSentence) &&
      hasCaps && firstSentence.length >= 20) {
      article.textContent = firstSentence;
    } else {
      // We can keep the title if the snippet is invalid
      // Generic articles defined globally
      article.textContent = getGeneric(genArticle);
    }

    // Hide loader once img served
    // Img errors are also handled in getDogs()
    // Timeout prevents premature error if img loads quickly
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(hideLoader());
      img.onerror = () => setInterval(5000,
          reject(new Error('image failed to load')));
    });
  } catch (err) {
    // Set generic content if no results
    // Generic content defined globally
    console.log(err);
    article.textContent = getGeneric(genArticle);
    title.textContent = getGeneric(genTitle);
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
