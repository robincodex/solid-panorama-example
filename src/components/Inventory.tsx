import { createSignal, Index, onCleanup } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';

const rootStyle = css`
    width: 600px;
    flow-children: right;
    horizontal-align: center;
    vertical-align: bottom;
    .equipItem {
        width: 60px;
        height: 60px;
        margin: 0 2px 2px 1px;
        border: 2px solid #353525;
        DOTAItemImage {
            width: 60px;
            height: 60px;
            z-index: 0;
            tooltip-position: top;
        }
    }
    .dragging_from {
        border: 2px solid red;
    }

    .trying_to_drop {
        border: 2px solid #5e6e31;
    }

    .selected {
        border: 1px solid red;
    }
`;

interface ItemContainerProps {
    selectItem?: boolean; // 是否是物品栏格子
    IsInventory?: boolean; // 是否是物品栏格子
    IsChessSlot?: boolean; // 是否是棋子栏的格子
    UnitEntityIndex: EntityIndex; // 格子拥有者的ID
    SlotIndex?: number; // 格子的序号
    ItemEntityIndex?: AbilityEntityIndex; // 物品序列号
    OnActivate?: (itemEntityIndex: number) => void;
    OnDblclick?: (itemEntityIndex: number) => void;
}

export interface DragCallbacks {
    removePositionBeforeDrop: boolean;
    offsetY: number;
    offsetX: number;
    displayPanel: Panel;
}

declare global {
    interface Panel {
        b_dragComplete: boolean;
        ItemEntityIndex: AbilityEntityIndex;
        OwnerEntityIndex: EntityIndex;
        UTILS_Name: string;
    }
}

function InventoryItem(props: ItemContainerProps) {
    const [selected, setToggleSelected] = createSignal(false);
    const GetItemName = () => Abilities.GetAbilityName(props.ItemEntityIndex!);
    const ShowItemTooltip = (panel: Panel) => {};
    const HideItemTooltip = () => {};

    /**
     * 开始拖动
     */
    const OnDragStart = (panel: Panel, dragCallbacks: IDragCallbacks) => {
        if (props.ItemEntityIndex! < 0) return true; //没有装备就不往下走
        if (selected()) {
            setToggleSelected(false);
            // props.OnActivate!(props.ItemEntityIndex!);
        }
        HideItemTooltip();
        let displayPanel = $.CreatePanel(
            'DOTAItemImage',
            $.GetContextPanel(),
            'dragImage'
        );
        displayPanel.itemname = GetItemName();
        displayPanel.ItemEntityIndex = props.ItemEntityIndex!;
        displayPanel.OwnerEntityIndex = props.UnitEntityIndex;
        displayPanel.b_dragComplete = false;
        dragCallbacks.displayPanel = displayPanel;
        dragCallbacks.offsetX = 30;
        dragCallbacks.offsetY = 22;
        panel.AddClass('dragging_from');
        return true;
    };

    /**
     * 结束拖动
     */
    const OnDragEnd = (panel: Panel, draggedPanel: Panel) => {
        //删除左上角产生的拖动副本
        draggedPanel.DeleteAsync(0);
        panel.RemoveClass('dragging_from');
        panel.RemoveClass('trying_to_drop');
        if (!draggedPanel.b_dragComplete) {
            const target = 0;
            if (target > 0) {
                // 如果有目标
                if (Entities.IsRealHero(draggedPanel.OwnerEntityIndex)) {
                    // 如果是从英雄给棋子，让英雄过去给
                    let order = {
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
                        TargetIndex: target,
                        AbilityIndex: draggedPanel.ItemEntityIndex!
                    };
                    Game.PrepareUnitOrders(order);
                }
                return true;
            } else {
                // 如果没目标，则代表丢弃
                if (Entities.IsRealHero(draggedPanel.OwnerEntityIndex)) {
                    Game.DropItemAtCursor(
                        draggedPanel.OwnerEntityIndex,
                        draggedPanel.ItemEntityIndex as ItemEntityIndex
                    );
                }
            }
        }
    };

    /**
     * 拖动某个面板到某个格子上了
     */
    const OnDragEnter = (panel: Panel, draggedPanel: any) => {
        let draggedItem = draggedPanel.itemname;
        if (draggedItem == null || draggedPanel == panel) {
            return true;
        }
        panel.AddClass('trying_to_drop');
        return true;
    };

    const OnDragLeave = (panel: Panel, draggedPanel: any) => {
        let draggedItem = draggedPanel.itemname;
        if (draggedItem == null || draggedPanel == panel) {
            return true;
        }
        panel.RemoveClass('trying_to_drop');
        return true;
    };

    /**
     * 丢到某个格子里面
     */
    const OnDragDrop = (panel: Panel, draggedPanel: Panel) => {
        let draggedItem = draggedPanel.ItemEntityIndex;
        if (draggedItem == null) return true;
        draggedPanel.b_dragComplete = true;

        if (draggedPanel.OwnerEntityIndex == props.UnitEntityIndex) {
            // 自己交换
            const swapOrder = {
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
                TargetIndex: props.SlotIndex,
                AbilityIndex: draggedItem
            };
            Game.PrepareUnitOrders(swapOrder);
        } else {
            // 给别人
            if (Entities.IsRealHero(draggedPanel.OwnerEntityIndex)) {
                // 如果是从英雄给棋子，让英雄过去给
                let order = {
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
                    TargetIndex: props.UnitEntityIndex,
                    AbilityIndex: draggedPanel.ItemEntityIndex!
                };
                Game.PrepareUnitOrders(order);
            }
        }
        return true;
    };

    //如果当前格子内没有装备，那么不可置为选中状态
    if (props.ItemEntityIndex! < 0 && selected() == true) {
        setToggleSelected(false);
    }

    return (
        <Panel
            className={`equipItem `}
            draggable={true}
            onDragStart={OnDragStart}
            onDragEnd={OnDragEnd}
            onDragEnter={OnDragEnter}
            onDragLeave={OnDragLeave}
            onDragDrop={OnDragDrop}
            onmouseover={ShowItemTooltip}
            onmouseout={HideItemTooltip}
            onactivate={() => {
                // props.OnActivate!(props.ItemEntityIndex!);
                props.ItemEntityIndex! > 0
                    ? setToggleSelected(!selected())
                    : setToggleSelected(false);
            }}
            ondblclick={() => {
                setToggleSelected(false);
                // props.OnDblclick!(props.ItemEntityIndex!);
            }}
        >
            <DOTAItemImage
                itemname={Abilities.GetAbilityName(props.ItemEntityIndex!)}
            />
        </Panel>
    );
}

//物品栏列表
const getItemList = () => {
    let items = [];
    for (let slot = 0; slot < 9; ++slot) {
        items.push(
            Entities.GetItemInSlot(Players.GetLocalPlayerPortraitUnit(), slot)
        );
    }
    return items;
};

//物品栏
const Inventory = () => {
    const [itemList, setItemList] = createSignal<ItemEntityIndex[]>(
        getItemList()
    );
    //调用原生事件监听
    let id = GameEvents.Subscribe('dota_inventory_changed', () => {
        setItemList(getItemList());
    });
    onCleanup(() => GameEvents.Unsubscribe(id));
    // //更新当前的装备栏
    const Update = () => {
        setItemList(getItemList());
    };
    const timer = setInterval(Update, Game.GetGameFrameTime());
    onCleanup(() => clearInterval(timer));
    return (
        <Panel class={rootStyle} hittest={false}>
            <Index each={[...Array(9).keys()]}>
                {slot => (
                    <InventoryItem
                        selectItem={true}
                        IsInventory={true}
                        SlotIndex={slot()}
                        ItemEntityIndex={itemList()[slot()]}
                        UnitEntityIndex={Players.GetPlayerHeroEntityIndex(
                            Players.GetLocalPlayer()
                        )}
                    />
                )}
            </Index>
        </Panel>
    );
};

export default Inventory;
