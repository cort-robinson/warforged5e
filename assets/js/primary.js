/*
primary.js - main js file
*/

$(document).ready(function () {
  const searchBar = document.getElementById('searchBar');
  let monsters = [];
  let monstersObjs = [];

  document.addEventListener('click', function (event) {
    if (event.target.matches('button')) {
      event.target.focus();
    }
  });

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
        return `<li class="monster" style="list-style-type: none"><button type="button" class="addMonster" id=${monster.index}>${monster.name}</button></li>`;
      })
      .join('');
    $('#monstersList').html(htmlString);
    $('.addMonster').each((index, element) => {
      let monsterId = $(element).attr('id');
      element.addEventListener('click', () => {
        addMonster(monsterId);
      });
    });
  };

  const sortObjs = () => {
    const sortByMapped = (map) => (compareFn) => (a, b) =>
      compareFn(map(a), map(b));
    const flipComparison = (fn) => (a, b) => -fn(a, b);
    const byValue = (a, b) => b - a;
    const byValueDex = (a, b) => a - b;

    const byInit = sortByMapped((e) => e.initiative)(byValue);
    const byDex = sortByMapped((e) => e.dexterity)(flipComparison(byValueDex));

    const sortByFlattened = (fns) => (a, b) =>
      fns.reduce((acc, fn) => acc || fn(a, b), 0);

    const byInitDex = sortByFlattened([byInit, byDex]);
    monstersObjs.sort(byInitDex);
  };

  const displaySelected = (monstersObjs) => {
    // Displays MonsterObjs list
    // console.log(monstersObjs); // temporary command for testing purposes
    monstersObjs.forEach(function (item, index) {
      item.id = index;
    });
    const htmlString = monstersObjs
      .map((monsterSelected) => {
        return `<tr class="monsterSelected">
                  <td class="name" id=${monsterSelected.id} contenteditable="True">${monsterSelected.name}</td>
                  <td class="initiative" id=${monsterSelected.id} contenteditable="True">${monsterSelected.initiative}</td>
                  <td class="hit_points" id=${monsterSelected.id} contenteditable="True">${monsterSelected.hit_points}</td>
                  <td class="armor_class" id=${monsterSelected.id} contenteditable="True">${monsterSelected.armor_class}</td>
                  <td contenteditable="False"><button class="displayStats" id=${monsterSelected.index}>Stats</button></td>;
                  <td contenteditable="False"><input class="removeMonster" type="image" src="assets/images/rmvicon.png" id=${monsterSelected.id}/></td>
                </tr>`;
      })
      .join('');
    $('#monstersSelected').html(htmlString);
    $('.displayStats').each((index, element) => {
      element.addEventListener('click', () => {
        let monster = $(element).attr('id');
        $.when(
          $.getJSON('https://www.dnd5eapi.co/api/monsters/' + monster)
        ).done(function (json) {
          displayStats(json);
        });
      });
    });
  };

  const displayStats = (monster) => {
    // Displays MonsterObjs list
    const speedString = Object.keys(monster.speed)
      .map((speed) => `${speed}: ${monster.speed[speed]}`)
      .join(', ');
    const damageImmunityString = Object.values(monster.damage_immunities).join(', ');
    const conditionImmunityString = Object.keys(monster.condition_immunities)
      .map((immunity) => monster.condition_immunities[immunity].index).join(', ');
    const sensesString = Object.keys(monster.senses)
      .map((sense) => `${sense}: ${monster.senses[sense]}`).join(', ');
    const htmlString = [];

    htmlString.push(`<div class="stat-block u-text-center">
	<div class="section-left">
		<div class="creature-heading">
      <h1>${monster.name}</h1>
      <h2>${monster.size} ${monster.type}, ${monster.alignment}</h2>
		</div> <!-- creature heading -->
		<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>
		<div class="top-stats">
			<div class="property-line first">
				<h4>Armor Class:&nbsp;</h4>
        <p>${monster.armor_class}</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Hit Points:&nbsp;</h4>
        <p>  ${monster.hit_points} ${monster.hit_dice}</p>
			</div> <!-- property line -->
			<div class="property-line last">
				<h4>Speed:&nbsp</h4>
        <p>${speedString}</p>
			</div> <!-- property line -->
			<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>
			<div class="abilities">
				<div class="ability-strength">
					<h4>STR</h4>
					<p>${monster.strength}</p>
				</div> <!-- ability strength -->
				<div class="ability-dexterity">
					<h4>DEX</h4>
					<p>${monster.dexterity}</p>
				</div> <!-- ability dexterity -->
				<div class="ability-constitution">
					<h4>CON</h4>
					<p>${monster.constitution}</p>
				</div> <!-- ability constitution -->
				<div class="ability-intelligence">
					<h4>INT</h4>
					<p>${monster.intelligence}</p>
				</div> <!-- ability intelligence -->
				<div class="ability-wisdom">
					<h4>WIS</h4>
					<p>${monster.wisdom}</p>
				</div> <!-- ability wisdom -->
				<div class="ability-charisma">
					<h4>CHA</h4>
					<p>${monster.charisma}</p>
				</div> <!-- ability charisma -->
			</div> <!-- abilities -->
			<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>
			<div class="property-line first">
				<h4>Damage Immunities:</h4>
        <br />
				<p>${damageImmunityString}</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Condition Immunities:</h4>
        <br />
				<p>${conditionImmunityString}</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Senses:</h4>
        <br />
				<p>${sensesString}</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Languages:</h4>
        <br />
				<p>${monster.languages}</p>
			</div> <!-- property line -->
			<div class="property-line last">
				<h4>Challenge:</h4>
        <br />
				<p>${monster.challenge_rating} (${monster.xp}xp)</p>
			</div> <!-- property line -->
		</div> <!-- top stats -->
		<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>`);

    for (ability of monster.special_abilities) {
      htmlString.push(
        `<div class="property-block">
          <h4>${ability.name}</h4>
          <br />
          <p>${ability.desc}</p>
        </div> <!-- property block -->`
      );
    }

    htmlString.push(`
      </div> <!-- section left -->
      <div class="section-right">
      <div class="actions">
			<h3>Actions</h3>`);

    for (action of monster.actions) {
      htmlString.push(
        `<div class="property-block">
				<h4>${action.name}</h4>
        <br />
				<p>${action.desc}</p>
			</div> <!-- property block -->`
      );
    }

    if (monster.legendary_actions) {
      htmlString.push(
        `</div> <!-- actions -->
      <div class="actions">
        <h3>Legendary Actions</h3>`
      );

      for (action of monster.legendary_actions) {
        htmlString.push(
          `<div class="property-block">
          <h4>${action.name}</h4>
          <br />
          <p>${action.desc}</p>
        </div> <!-- property block -->`
        );
      }
    }

    htmlString.push(
      `</div> <!-- actions -->
	    </div> <!-- section right -->
      </div>`
    );

    $('#monsterStats').html(htmlString.join(''));
  };

  const addMonster = (monsterId) => {
    $.when($.getJSON('https://www.dnd5eapi.co/api/monsters/' + monsterId)).done(
      function (json) {
        json.initiative = 'Roll for it!';
        monstersObjs.push(json);
        updateObjs();
        displaySelected(monstersObjs);
      }
    );
  };

  $('#monstersSelected').on('click', '.removeMonster', () => {
    const index = parseInt($(this.activeElement).attr('id'), 10);
    monstersObjs.splice(index, 1);
    displaySelected(monstersObjs);
  });

  $('#selectedMonsters').on('click', '.initiativeRoll', () => {
    monstersObjs.forEach(function (item, index) {
      item.initiative =
        Math.ceil((item.dexterity - 10) / 2) +
        Math.floor(Math.random() * 20) +
        1;
    });
    updateObjs();
    sortObjs();
    monstersObjs.forEach(function (item, index) {
      item.id = index;
    });
    displaySelected(monstersObjs);
  });

  const updateObjs = () => {
    $('.name').each((index, current) => {
      let newValue = $(current).html();
      let monsterIdx = $(current).attr('id');

      if (newValue !== monstersObjs[monsterIdx].name) {
        monstersObjs[monsterIdx].name = newValue;
      }
    });

    $('.initiative').each((index, current) => {
      let newValue = parseInt($(current).html());
      let monsterIdx = $(current).attr('id');

      if (
        newValue !== monstersObjs[monsterIdx].initiative &&
        $(current).html() !== 'Roll for it!'
      ) {
        monstersObjs[monsterIdx].initiative = newValue;
      }
    });

    $('.hit_points').each((index, current) => {
      let newValue = parseInt($(current).html());
      let monsterIdx = $(current).attr('id');

      if (newValue !== monstersObjs[monsterIdx].hit_points) {
        monstersObjs[monsterIdx].hit_points = newValue;
      }
    });

    $('.armor_class').each((index, current) => {
      let newValue = parseInt($(current).html());
      let monsterIdx = $(current).attr('id');

      if (newValue !== monstersObjs[monsterIdx].armor_class) {
        monstersObjs[monsterIdx].armor_class = newValue;
      }
    });
  };

  $('.update').on('click', () => {
    updateObjs();
    sortObjs();
    displaySelected(monstersObjs);
  });
  loadMonsters(); // Call loadMonsters to initiate
});
