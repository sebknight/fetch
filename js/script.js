const button = document.getElementById('fetch');
const imgContainer = document.getElementById('image-container');
const img = document.getElementById('image');
const title = document.getElementById('title');
const article = document.getElementById('article');

const getImage = data => {
  const path = data.message;
  img.src = path;
}

const getFacts = data => {
  const path = data.message;
  // Break down the response to extract the breed name
  const pathArr = path.split('/');
  const breedIndex = pathArr[4];
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
    const cleanSnippet = snippet.replace(/<(?:.|\n)*?>/gm, '');
    const firstSentence = `${cleanSnippet.substring(0, cleanSnippet.indexOf('.'))}.`;
    // Reduces garbage output
    firstSentence.length > 15 ?
      article.textContent = firstSentence :
      article.textContent = "What kind of dog is that? A good one!"  
  })
}

const dogReq = new Request('https://dog.ceo/api/breeds/image/random');

// Query the Dog API!
button.addEventListener('click', () => {
  fetch(dogReq)
  .then((res) => {
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