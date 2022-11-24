'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

const AbilityStyle = "styled-50952f12";
function Ability(props) {
  return (() => {
    const _el$ = libs.createElement("Panel", {
        "class": AbilityStyle
      }, null),
      _el$2 = libs.createElement("DOTAAbilityImage", {
        get contextEntityIndex() {
          return props.ability;
        }
      }, _el$);
    libs.setProp(_el$, "class", AbilityStyle);
    libs.effect(_$p => libs.setProp(_el$2, "contextEntityIndex", props.ability, _$p));
    return _el$;
  })();
}
const DotaAbilitiesStyle = "styled-9a15cb87";
function DotaAbilities() {
  const [unit, setUnit] = libs.createSignal(Players.GetLocalPlayerPortraitUnit());
  const [abilities, setAbilities] = libs.createSignal([]);
  libs.useGameEvent('dota_player_update_query_unit', evt => {
    setUnit(Players.GetLocalPlayerPortraitUnit());
  }, unit());
  libs.useGameEvent('dota_player_update_selected_unit', evt => {
    setUnit(Players.GetLocalPlayerPortraitUnit());
  }, unit());

  function updateAbilities() {
    const currentUnit = unit();
    if (currentUnit < 0) {
      if (abilities().length > 0) {
        setAbilities([]);
      }
      return;
    }
    const list = [];
    const count = Entities.GetAbilityCount(currentUnit);
    for (let i = 0; i < count; i++) {
      const ability = Entities.GetAbility(currentUnit, i);
      if (Entities.IsValidEntity(ability)) {
        if (Abilities.IsHidden(ability) || Abilities.IsAttributeBonus(ability) || Abilities.GetAbilityType(ability) === ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES) {
          continue;
        }
        list.push(ability);
      }
    }
    if (abilities().length <= 0) {
      setAbilities(list);
    } else if (libs.difference_1(abilities(), list).length > 0) {
      setAbilities([...list]);
    }
  }
  libs.createEffect(() => {
    updateAbilities();
  }, unit());
  return (() => {
    const _el$3 = libs.createElement("Panel", {
      "class": DotaAbilitiesStyle
    }, null);
    libs.setProp(_el$3, "class", DotaAbilitiesStyle);
    libs.insert(_el$3, libs.createComponent(libs.For, {
      get each() {
        return abilities();
      },
      children: ability => libs.createComponent(Ability, {
        ability: ability
      })
    }));
    return _el$3;
  })();
}

const rootStyle = "styled-1ed2f423";
function App() {
  let root;
  libs.onMount(() => {
    console.log('Created lowhud', rootStyle);
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle
    }, null);
    const _ref$ = root;
    typeof _ref$ === "function" ? libs.use(_ref$, _el$) : root = _el$;
    libs.setProp(_el$, "class", rootStyle);
    libs.insert(_el$, libs.createComponent(DotaAbilities, {}));
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}), $('#app'));
