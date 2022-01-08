import {Stage, Text, video, loader, state, event, game, input, plugins} from 'melonjs/dist/melonjs.module.js';
import PlayScreen from 'js/stage/play.js';
import Character from 'js/renderables/character.js';
import {DataManifest, Characters} from 'manifest.js';

function gameScreen() {

  let save = document.getElementById('savesettings').checked;
  if (save == true){
    localStorage.setItem('nick', document.getElementById('name').value);
    localStorage.setItem('character', document.getElementById('character').value);
  } else {
    localStorage.clear();
  }

  state.set(state.PLAY, new PlayScreen("lobby"));
  state.change(state.PLAY);
}


class TitleScreen extends Stage {
  onResetEvent() {
    plugins.keys.title();


/*
    for(let i=1; i<= 16; i++){
      let n = "";
      if (i < 10){
        n = "0";
      }
      document.getElementById('characters').append(
        loader.getImage("sample_character_"+n+i)
      );
    }
*/
    let chr = localStorage.getItem('character');
    let nick = localStorage.getItem('nick');
    if (nick != null){
      document.getElementById('name').value = nick;
      document.getElementById('savesettings').checked = true;
    }

    this.characterSelect(chr);

    this.setMenu('inherit');
    this.handler = event.on(event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        gameScreen();
      }
    });

    document.getElementById('start').addEventListener('click', btn => {
      gameScreen();
    });

  }

  characterSelect(chr){

    let canvas_x = document.getElementsByTagName("canvas")[0].width;
    let container = document.getElementById('characters');
    let x = 0;
    let y = 0;
    Characters.forEach((char) => {
      let a = new Character({image: char.name, src: char.src}, x, y);
      game.world.addChild(a);
      if (chr == char.name){
        a.setactive();
      }
      x += 32;
      if (x + 32 > canvas_x){
        x = 0;
        y += 32;
      }

    });
  }

  setMenu(display){
    let menu = document.getElementById('menu-overlay').style;
    menu.setProperty("display", display);
  }

  onDestroyEvent() {
    plugins.keys.game();

    this.setMenu('none');
  }
};

export default TitleScreen;
