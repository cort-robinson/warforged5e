$(document).ready(function () {
  $.get('https://www.dnd5eapi.co/api/monsters/', function (data) {
    const monsters = data.results;
    for (monster of monsters) {
      $('.monsterList').append('<li>' + monster.name + '</li>')
    }
  });
});
