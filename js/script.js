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
  fetch(`http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${breed}%20dog&format=jsonfm`, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data.query.search[0].snippet);
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