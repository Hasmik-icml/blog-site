// For testing

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
      body.innerHTML =`${data.data[0].name}`;
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

}
document.addEventListener('DOMContentLoaded', () => {
    fetchWords();
  });