const button = document.getElementById('fetch');
const picDiv = document.getElementById('picture');

const dogReq = new Request('https://dog.ceo/api/breeds/image/random');

// const getBreed = data => {
//   const path = data.message;
//   const pathArr = path.split('/');
//   const breedIndex = pathArr[4];
//   const breed = breedIndex.replace('-', ' ');
// }

const getImage = data => {
  const path = data.message;
  const img = document.createElement('img');
  img.src = path;
  picDiv.appendChild(img)
}

const getFacts = data => {
  const path = data.message;
  const pathArr = path.split('/');
  const breedIndex = pathArr[4];
  const breed = breedIndex.replace('-', '%20');
  fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${breed}%20dog&format=json&origin=*`, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const snippet = data.query.search[0].snippet;
    const cleanSnippet = snippet.replace(/<(?:.|\n)*?>/gm, '');
    console.log(cleanSnippet);
  })
}

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
    console.log('Error')
  })
});