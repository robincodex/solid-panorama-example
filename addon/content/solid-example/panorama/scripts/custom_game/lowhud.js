'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');
var Button = require('./Button.js');

function ButtonGroup() {
  const style = "styled-8c947fd3";
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": style
    }, null);
    libs.setProp(_el$, "class", style);
    libs.insert(_el$, libs.createComponent(Button.CButton, {
      color: "R"
    }, _el$), null);
    libs.insert(_el$, libs.createComponent(Button.CButton, {
      color: "G"
    }, _el$), null);
    libs.insert(_el$, libs.createComponent(Button.CButton, {
      color: "B"
    }, _el$), null);
    return _el$;
  })();
}

const rootStyle = "styled-1ed2f423";
function App() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle
    }, null);
    libs.setProp(_el$, "class", rootStyle);
    libs.insert(_el$, libs.createComponent(ButtonGroup, {}, _el$));
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}, null), $('#app'));
