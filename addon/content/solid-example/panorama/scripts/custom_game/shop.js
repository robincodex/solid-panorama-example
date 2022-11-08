'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');
var Button = require('./Button.js');

const rootStyle = "styled-e2b76839";
function App() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle
    }, null);
    libs.setProp(_el$, "class", rootStyle);
    libs.insert(_el$, libs.createComponent(Button.CButton, {
      text: "Button A",
      small: true
    }, _el$), null);
    libs.insert(_el$, libs.createComponent(Button.CButton, {
      text: "Button B"
    }, _el$), null);
    libs.insert(_el$, libs.createComponent(Button.CButton, {
      text: "Button C",
      large: true
    }, _el$), null);
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}, null), $('#app'));
