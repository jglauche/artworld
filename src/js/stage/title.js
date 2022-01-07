import {Stage, Text, state, event, game, input, plugins} from 'melonjs/dist/melonjs.module.js';
import PlayScreen from 'js/stage/play.js';

function gameScreen() {
  let save = document.getElementById('savesettings').checked;
  if (save == true){
    localStorage.setItem('nick', document.getElementById('name').value);
  } else {
    localStorage.clear();
  }

  state.set(state.PLAY, new PlayScreen("lobby"));
  state.change(state.PLAY);
}


class TitleScreen extends Stage {
  onResetEvent() {
    plugins.keys.title();

    let nick = localStorage.getItem('nick');
    if (nick != null){
      document.getElementById('name').value = nick;
      document.getElementById('savesettings').checked = true;
    }

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
