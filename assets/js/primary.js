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
      const htmlString = monsters
      .map((monster) => {
        return `
        <li class="monster"><button class="addMonster" id=${monster.index}>Add</button>&nbsp;${monster.name}</li>`;
      })
      .join('');
      $('#monstersList').html(htmlString);
    };
  
    loadMonsters();
    // Call loadMonsters to initiate
  
    $('#monstersList').on('click', '.addMonster', () => {
      $.when(
        $.getJSON('https://www.dnd5eapi.co/api/monsters/' + $(this.activeElement).attr('id'))
    ).done( function(json) {
        monstersObjs.push(json);
        // temporary command for testing purposes
        console.log(monstersObjs);
    });
    });

    $('#searchBar').focus( () => {
        $('#monstersList').removeClass('inactive');
    }) 
  });
