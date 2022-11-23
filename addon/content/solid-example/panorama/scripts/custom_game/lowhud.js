'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

function useTimer(...args) {
  let firstDelay = 0;
  let callback;
  if (args.length === 2) {
    firstDelay = args[0];
    callback = args[1];
    args[2];
  } else {
    callback = args[0];
    args[1];
  }
  libs.createEffect(() => {
    let t;
    const running = () => {
      const next = callback();
      if (next) {
        t = $.Schedule(next, running);
      }
    };
    t = $.Schedule(firstDelay, running);
    return () => {
      try {
        $.CancelScheduled(t);
      } catch (e) {}
    };
  });
}

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
  useTimer(() => {
    updateAbilities();
    return 0.2;
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
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle
    }, null);
    libs.setProp(_el$, "class", rootStyle);
    libs.insert(_el$, libs.createComponent(DotaAbilities, {}));
    return _el$;
  })();
}
libs.render(() => libs.createComponent(App, {}), $('#app'));
