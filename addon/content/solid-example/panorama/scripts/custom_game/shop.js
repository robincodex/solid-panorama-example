'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

function CButton({
  text,
  icon
}) {
  return (() => {
    const _el$ = libs.createElement("Button", {}, null),
      _el$2 = libs.createElement("Image", {
        src: icon ? `file://{images}/custom_game/${icon}` : '',
        visible: !!icon
      }, _el$),
      _el$3 = libs.createElement("Label", {
        text: text,
        visible: !!text
      }, _el$);
    libs.setProp(_el$2, "src", icon ? `file://{images}/custom_game/${icon}` : '');
    libs.setProp(_el$2, "visible", !!icon);
    libs.setProp(_el$3, "text", text);
    libs.setProp(_el$3, "visible", !!text);
    return _el$;
  })();
}

const rootStyle = "styled-49c05845";
function App() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle
    }, null);
    libs.setProp(_el$, "class", rootStyle);
    libs.insert(_el$, libs.createComponent(CButton, {
      text: "Button A"
    }, _el$));
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}, null), $('#app'));
