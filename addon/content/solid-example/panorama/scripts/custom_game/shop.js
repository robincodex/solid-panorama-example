'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

const _excluded = ["text", "icon", "color"];
function CButton(_ref) {
  let {
      text,
      icon,
      color
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  return (() => {
    const _el$ = libs.createElement("Button", {
        "class": "btnStyle"
      }, null),
      _el$2 = libs.createElement("Image", {
        src: icon ? `file://{images}/custom_game/${icon}` : ''
      }, _el$),
      _el$3 = libs.createElement("Label", {
        text: text
      }, _el$);
    libs.setProp(_el$2, "src", icon ? `file://{images}/custom_game/${icon}` : '');
    libs.setProp(_el$2, "visible", !!icon);
    libs.setProp(_el$3, "text", text);
    libs.setProp(_el$3, "visible", !!text);
    libs.effect(_$p => libs.setProp(_el$, "classList", {
      R: color === 'R',
      G: color === 'G',
      B: color === 'B',
      small: props.small === true,
      large: props.large === true
    }, _$p));
    return _el$;
  })();
}

const rootStyle = "styled-9aa8fd3e";
function App() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle
    }, null);
    libs.setProp(_el$, "class", rootStyle);
    libs.insert(_el$, libs.createComponent(CButton, {
      text: "Button A",
      small: true
    }), null);
    libs.insert(_el$, libs.createComponent(CButton, {
      text: "Button B"
    }), null);
    libs.insert(_el$, libs.createComponent(CButton, {
      text: "Button C",
      large: true
    }), null);
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}), $('#app'));
