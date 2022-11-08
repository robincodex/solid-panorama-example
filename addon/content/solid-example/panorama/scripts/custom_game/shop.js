'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

const rootStyle = "styled-49c05845";
function App() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle
    }, null);
    libs.createTextNode(`Hello World!`, _el$);
    libs.setProp(_el$, "class", rootStyle);
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}, null), $('#app'));
