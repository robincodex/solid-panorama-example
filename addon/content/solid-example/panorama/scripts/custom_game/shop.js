'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

const rootStyle = "styled-9aa8fd3e";
function App() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle,
      hittest: false
    }, null);
    libs.setProp(_el$, "class", rootStyle);
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}), $('#app'));
