'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

function Item(props) {
  let [root, setRoot] = libs.createSignal(null);
  let [text, setText] = libs.createSignal('');
  let el;
  libs.onMount(() => {
    $.Msg('onMount ', el);
  });
  libs.createEffect(() => {
    $.Msg('effect root ', root());
  }, root);
  return (() => {
    const _el$ = libs.createElement("Panel", {
        id: "root"
      }, null),
      _el$2 = libs.createElement("Label", {}, _el$);
    const _ref$ = el;
    typeof _ref$ === "function" ? libs.use(_ref$, _el$) : el = _el$;
    libs.effect(_$p => libs.setProp(_el$2, "text", text(), _$p));
    return _el$;
  })();
}
function HelloWorld() {
  return (() => {
    const _el$3 = libs.createElement("Panel", {}, null);
      libs.createTextNode(`Hello World!`, _el$3);
    libs.setProp(_el$3, "style", {
      flowChildren: 'right'
    });
    libs.insert(_el$3, libs.createComponent(Item, {
      show: true
    }, _el$3), null);
    return _el$3;
  })();
}
libs.render(() => libs.createComponent(HelloWorld, {}, null), $('#app'));
