import {Stage, Text, state, event, game, input, plugins} from 'melonjs/dist/melonjs.module.js';
import PlayScreen from 'js/stage/play.js';

class TitleScreen extends Stage {
  onResetEvent() {
    plugins.keys.title();

    this.setMenu('inherit');
    document.getElementById('start').addEventListener('click', btn => {
      state.set(state.PLAY, new PlayScreen("lobby"));
      state.change(state.PLAY);
    });

    this.handler = event.on(event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        state.set(state.PLAY, new PlayScreen("lobby"));
        state.change(state.PLAY);
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
