const button = document.querySelector('.btn');
const imgContainer = document.querySelector('.content__image-container');
const img = document.querySelector('.content__image');
const title = document.querySelector('.content__title');
const article = document.querySelector('.content__article');
const loader = document.querySelector('.content__loader');

const showLoader = () => {
  img.style.display = 'none';
  loader.style.visibility = 'visible';
}

const hideLoader = () => {
  loader.style.visibility = 'hidden';
  img.style.display = 'block';
}

const getImage = data => {
  img.onload = hideLoader();
  const path = data.message;
  img.src = path;
}

const getFacts = data => {
  const path = data.message;
  // Break down the response to extract the breed name
  const pathArr = path.split('/');
  const breedIndex = pathArr[4];
  // Replace any dashes in the breed name with a space
  const breed = breedIndex.replace('-', '%20');
  // Query the Wikipedia API for the breed
  fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${breed}%20dog&format=json&origin=*`, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // Get the snippet, scrub it of markup, 
    // then extract the first sentence
    // and replace the full stop
    const snippet = data.query.search[0].snippet;

    // Not ideal to use innerHTML, but should be OK 
    // because it only returns text content.
    // Faster than using a regex and accounts for escaped characters
    const cleanSnippet = () => {
      if (snippet) {
        const div = document.createElement('div');
        div.innerHTML = snippet;
        return div.textContent;
      }
    }
    
    const firstSentence = `${cleanSnippet().substring(0, cleanSnippet().indexOf('.'))}.`;
    // Reduces garbage output
    firstSentence.length > 10 ?
      article.textContent = firstSentence :
      article.textContent = 'What kind of dog is that? A good one!' 
  })
}

const dogReq = new Request('https://dog.ceo/api/breeds/image/random');

// Query the Dog API!
button.addEventListener('click', () => {
  fetch(dogReq)
  .then((res) => {
    showLoader();
    return res.json();
    })
    .then((data) => {
    getImage(data);
    getFacts(data);
  })
  .catch(() => {
    console.log(`Error`)
  })
});