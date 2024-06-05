const body = document.getElementById("test");



async function fetchWords() {
    fetch(`http://localhost:3010/menu-submenu/${'menu'}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(111, data);
      body.innerHTML = data[0];
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });


    // const response = await fetch(`http://backend:3000/menu-submenu/${'menu'}`);
    // console.log('response', response);
    // const randomWords = await response.json();
    // console.log(111, randomWords);
    // body.innerHTML = randomWords[0];
}
document.addEventListener('DOMContentLoaded', () => {
    fetchWords();
  });