/*
primary.js - main js file
*/
const monstersList = document.getElementById('monstersList');
const searchBar = document.getElementById('searchBar');
let monsters = [];

searchBar.addEventListener('keyup', (e) => {
  // Search bar function - listens to key strokes
  const searchString = e.target.value.toLowerCase();
  const filteredMonsters = monsters.filter((monster) => {
    return (
      monster.name.toLowerCase().includes(searchString)
    );
  })
  displayMonsters(filteredMonsters);
});

const loadMonsters = async () => {
  // Load the monsters API list and calls displayMonsters
  try {
    const res = await $.get('https://www.dnd5eapi.co/api/monsters/');
    monsters = await res.results;
    displayMonsters(monsters);
  } catch (err) {
    console.error(err);
  }
}

const displayMonsters = (monsters) => {
  // Takes list from loadMonsters and outputs that into the html
  const htmlString = monsters
    .map((monster) => {
      return `
      <li class="monster">
          <h2>${monster.name}</h2>
      </li>
    `;
    })
    .join('');
  monstersList.innerHTML = htmlString;
}

loadMonsters();
// Call loadMonsters to initiate
