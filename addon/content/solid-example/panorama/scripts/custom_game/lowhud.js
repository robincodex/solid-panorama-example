'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

function App() {
  return (() => {
    const _el$ = libs.createElement("Panel", {}, null);
    libs.createTextNode(`Hello World!`, _el$);
    libs.setProp(_el$, "style", {
      flowChildren: 'right'
    });
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}, null), $('#app'));
