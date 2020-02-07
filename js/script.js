const button = document.querySelector('.btn');
const imgContainer = document.querySelector('.content__img-container');
const img = document.querySelector('.content__img');
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
  const path = data.message;
  img.src = path;
  hideLoader();
}

const getBreed = data => {
  const path = data.message;
  // Break down the response to extract the breed name
  const pathArr = path.split('/');
  const breedIndex = pathArr[4];
  // Replace any dashes in the breed name with a space
  return breedIndex.replace('-', '%20');
}

const getSnippet = snippet => {
  if (snippet) {
    // Not ideal to use innerHTML, but should be OK 
    // because it only returns text content.
    // Faster than using a regex and accounts for escaped characters
    const div = document.createElement('div');
    div.innerHTML = snippet;
    const cleanSnippet = div.textContent;
    const firstSentence = `${cleanSnippet.substring(0, cleanSnippet.indexOf('.'))}.`;
    // Reduces garbage output by checking sentence starts with an upper case letter
    // and is longer than 15 characters
    if (firstSentence[0] !== firstSentence[0].toLowerCase() && firstSentence.length > 15) {
      return article.textContent = firstSentence;
    } else {
      return article.textContent = 'What kind of dog is that? A good one!';
    }
  }
}


const getFacts = data => {
  const breed = getBreed(data);
  // Query the Wikipedia API for the breed
  fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${breed}%20dog&format=json&origin=*`, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const snippet = data.query.search[0].snippet;
    getSnippet(snippet);
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