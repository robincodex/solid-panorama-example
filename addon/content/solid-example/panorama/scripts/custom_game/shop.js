'use strict'; const require = GameUI.__require;

var libs = require('./libs.js');

function EquipItemSlot(props) {
  const [selected, setToggleSelected] = libs.createSignal(false);
  const GetItemName = () => Abilities.GetAbilityName(props.ItemEntityIndex);
  const ShowItemTooltip = panel => {};
  const HideItemTooltip = () => {};
  const OnDragStart = (panel, dragCallbacks) => {
    if (props.ItemEntityIndex < 0) return true;
    if (selected()) {
      setToggleSelected(false);
    }
    let displayPanel = $.CreatePanel('DOTAItemImage', $.GetContextPanel(), 'dragImage');
    displayPanel.itemname = GetItemName();
    displayPanel.ItemEntityIndex = props.ItemEntityIndex;
    displayPanel.OwnerEntityIndex = props.UnitEntityIndex;
    displayPanel.b_dragComplete = false;
    dragCallbacks.displayPanel = displayPanel;
    dragCallbacks.offsetX = 30;
    dragCallbacks.offsetY = 22;
    panel.AddClass('dragging_from');
    return true;
  };
  const OnDragEnd = (panel, draggedPanel) => {
    draggedPanel.DeleteAsync(0);
    panel.RemoveClass('dragging_from');
    panel.RemoveClass('trying_to_drop');
    if (!draggedPanel.b_dragComplete) {
      {
        if (Entities.IsRealHero(draggedPanel.OwnerEntityIndex)) {
          Game.DropItemAtCursor(draggedPanel.OwnerEntityIndex, draggedPanel.ItemEntityIndex);
        }
      }
    }
  };
  const OnDragEnter = (panel, draggedPanel) => {
    let draggedItem = draggedPanel.itemname;
    if (draggedItem == null || draggedPanel == panel) {
      return true;
    }
    panel.AddClass('trying_to_drop');
    return true;
  };
  const OnDragLeave = (panel, draggedPanel) => {
    let draggedItem = draggedPanel.itemname;
    if (draggedItem == null || draggedPanel == panel) {
      return true;
    }
    panel.RemoveClass('trying_to_drop');
    return true;
  };
  const OnDragDrop = (panel, draggedPanel) => {
    let draggedItem = draggedPanel.ItemEntityIndex;
    if (draggedItem == null) return true;
    draggedPanel.b_dragComplete = true;
    if (draggedPanel.OwnerEntityIndex == props.UnitEntityIndex) {
      const swapOrder = {
        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
        TargetIndex: props.SlotIndex,
        AbilityIndex: draggedItem
      };
      Game.PrepareUnitOrders(swapOrder);
    } else {
      if (Entities.IsRealHero(draggedPanel.OwnerEntityIndex)) {
        let order = {
          OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
          TargetIndex: props.UnitEntityIndex,
          AbilityIndex: draggedPanel.ItemEntityIndex
        };
        Game.PrepareUnitOrders(order);
      }
    }
    return true;
  };
  if (props.ItemEntityIndex < 0 && selected() == true) {
    setToggleSelected(false);
  }
  return (() => {
    const _el$ = libs.createElement("Panel", {
        draggable: true
      }, null),
      _el$2 = libs.createElement("DOTAItemImage", {
        get itemname() {
          return Abilities.GetAbilityName(props.ItemEntityIndex);
        }
      }, _el$);
    libs.setProp(_el$, "className", `equipItem `);
    libs.setProp(_el$, "onDragStart", OnDragStart);
    libs.setProp(_el$, "onDragEnd", OnDragEnd);
    libs.setProp(_el$, "onDragEnter", OnDragEnter);
    libs.setProp(_el$, "onDragLeave", OnDragLeave);
    libs.setProp(_el$, "onDragDrop", OnDragDrop);
    libs.setProp(_el$, "onmouseover", ShowItemTooltip);
    libs.setProp(_el$, "onmouseout", HideItemTooltip);
    libs.setProp(_el$, "onactivate", () => {
      props.ItemEntityIndex > 0 ? setToggleSelected(!selected()) : setToggleSelected(false);
    });
    libs.setProp(_el$, "ondblclick", () => {
      setToggleSelected(false);
    });
    libs.effect(_$p => libs.setProp(_el$2, "itemname", Abilities.GetAbilityName(props.ItemEntityIndex), _$p));
    return _el$;
  })();
}

const rootStyle = "styled-9aa8fd3e";
const getItemList = () => {
  let items = [];
  for (let slot = 0; slot < 9; ++slot) {
    items.push(Entities.GetItemInSlot(Players.GetLocalPlayerPortraitUnit(), slot));
  }
  return items;
};
const EquipList = () => {
  const [itemList, setItemList] = libs.createSignal(getItemList());
  let id = GameEvents.Subscribe('dota_inventory_changed', () => {
    setItemList(getItemList());
  });
  libs.onCleanup(() => GameEvents.Unsubscribe(id));
  const Update = () => {
    setItemList(getItemList());
  };
  const timer = setInterval(Update, Game.GetGameFrameTime());
  libs.onCleanup(() => clearInterval(timer));
  return (() => {
    const _el$ = libs.createElement("Panel", {
      hittest: false
    }, null);
    libs.setProp(_el$, "className", "equipList");
    libs.insert(_el$, libs.createComponent(libs.Index, {
      get each() {
        return [...Array(9).keys()];
      },
      children: slot => libs.createComponent(EquipItemSlot, {
        selectItem: true,
        IsInventory: true,
        get SlotIndex() {
          return slot();
        },
        get ItemEntityIndex() {
          return itemList()[slot()];
        },
        get UnitEntityIndex() {
          return Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
        }
      })
    }));
    return _el$;
  })();
};
function App() {
  return (() => {
    const _el$2 = libs.createElement("Panel", {
      "class": rootStyle,
      hittest: false
    }, null);
    libs.setProp(_el$2, "class", rootStyle);
    libs.insert(_el$2, libs.createComponent(EquipList, {}));
    return _el$2;
  })();
}
libs.render(() => libs.createComponent(App, {}), $('#app'));
