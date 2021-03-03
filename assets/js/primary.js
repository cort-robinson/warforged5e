/*
primary.js - main js file
*/
$(document).ready(function () {
  const searchBar = document.getElementById('searchBar');
  let monsters = [];
  let monstersObjs = [];

  searchBar.addEventListener('keyup', (e) => {
    // Search bar function - listens to key strokes
    const searchString = e.target.value.toLowerCase();
    const filteredMonsters = monsters.filter((monster) => {
      return monster.name.toLowerCase().includes(searchString);
    });
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
  };

  const displayMonsters = (monsters) => {
    // Takes list from loadMonsters and outputs that into the html
    for (monster of monsters) {
      $('#monstersList').append(
        `
        <li class="monster">
            <h2><button type="button" class="addMonster" id=${monster.index}>Add</button>&nbsp;${monster.name}</h2>
        </li>
      `
      );
    }
    $('#monstersList').on('click', '.addMonster', () => {
      $.when(
        $.getJSON('https://www.dnd5eapi.co/api/monsters/' + $(this.activeElement).attr('id'))
    ).done( function(json) {
        monstersObjs.push(json);
    });
    console.log(monstersObjs);
    });
  };

  loadMonsters();
  // Call loadMonsters to initiate $(this.activeElement).attr('id')

});
