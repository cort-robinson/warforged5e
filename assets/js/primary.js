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
        return `<li class="monster"><button class="addMonster" id=${monster.index}>Add</button>&nbsp;${monster.name}</li>`;
      })
      .join('');
      $('#monstersList').html(htmlString);
    };

    const displaySelected = (monstersObjs) => {
      // Displays MonsterObjs list
      console.log(monstersObjs); // temporary command for testing purposes
      const htmlString = monstersObjs
      .map((monsterSelected) => {
        return `<li class="monsterSelected">
                  <button class="displayStats" id=${monsterSelected.index}>
                    ${monsterSelected.name}
                  </button>&nbsp;
                  <input type="image" src="assets/images/rmvicon.png" onfocus="removeMonster(${monsterSelected})"/>
                </li>`;
      })
      .join('');
      $('#monstersSelected').html(htmlString);
    };
  
    const displayStats = (monster) => {
      // Displays MonsterObjs list
      const htmlString = 
        `<li class="monsterStats">Monster: ${monster.name}</li>
        <li class="monsterStats">HP: ${monster.hit_points}</li>
        <li class="monsterStats">AC: ${monster.armor_class}</li>
        <li class="monsterStats">Charisma: ${monster.charisma}</li>
        <li class="monsterStats">Constitution: ${monster.constitution}</li>
        <li class="monsterStats">Dexterity: ${monster.dexterity}</li>
        <li class="monsterStats">Intelligence: ${monster.intelligence}</li>
        <li class="monsterStats">Strength: ${monster.strength}</li>
        <li class="monsterStats">Wisdom: ${monster.wisdom}</li>`;
      $('#monsterStats').html(htmlString);
    };

    function removeMonster(monster) {
      console.log("hi")
      const index = monstersObjs.indexOf(monster);
      if (index > -1) {
        monstersObjs.splice(index, 1);
      }
      displaySelected(monstersObjs);
    };
  
    loadMonsters(); // Call loadMonsters to initiate
  
    $('#monstersList').on('click', '.addMonster', () => {
      $.when(
        $.getJSON('https://www.dnd5eapi.co/api/monsters/' + $(this.activeElement).attr('id'))
    ).done( function(json) {
        json.id = Math.floor((Math.random() * 1000) + 1);
        monstersObjs.push(json);
        displaySelected(monstersObjs);
    });
    });
  
    $('#monstersSelected').on('click', '.displayStats', () => {
      $.when(
        $.getJSON('https://www.dnd5eapi.co/api/monsters/' + $(this.activeElement).attr('id'))
    ).done( function(json) {
        displayStats(json);
    });
    });
  
    $('#removeButton').focus( () => {});
  
    $('#searchBar').focus( () => {
        $('#monstersList').removeClass('inactive');
    }) 
  });
