'use strict'; const exports = {}; GameUI.__loadModule('Button', exports); const require = GameUI.__require;

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

exports.CButton = CButton;
