import * as me from 'melonjs/dist/melonjs.module.js';
import {FluentBundle, FluentResource} from "@fluent/bundle";

// import artworld from "/data/map/artworld.ftl";
async function load(lvl){
    return fetch("/data/map/"+lvl+".ftl")
      .then(response => response.text())
      .then(data => {
        return new FluentResource(data);
    });
}
const EventEmitter = require('events');
const bus = new EventEmitter();


class Fluent extends me.plugin.Base{
  constructor(lang="en"){
    super();
    this.lang=lang;
    this.level = "";
    this.bundle = new FluentBundle(this.lang);
    this.lock = false;
  }


  set_level(lvl){
    this.lock = true;
    this.level = lvl;
    this.bundle = new FluentBundle(this.lang);
    load(lvl).then(res => {
      console.log(res);
      this.bundle.addResource(res);
      console.log("loaded ftl: "+lvl);
      this.lock = false;
      bus.emit('unlocked');
    });
  }

  async rdy(){
    if (this.lock) await new Promise(resolve => bus.once('unlocked', resolve));
  }

  async get_slug(slug){
    return (this.rdy()).then(a => {
      let msg = this.bundle.getMessage(slug)
      if (msg != undefined) {
        return msg.value
      }
      return slug
  });

  }

  test(){
    console.log("lang: "+this.lang+" level:" + this.level);
  }

};
export default Fluent;
