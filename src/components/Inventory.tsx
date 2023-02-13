import { createSignal, Index, onCleanup } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { useGameEvent } from 'solid-panorama-all-in-jsx/events.macro';

const rootStyle = css`
    width: 600px;
    flow-children: right;
    horizontal-align: center;
    vertical-align: bottom;
    .inventoryItem {
        width: 60px;
        height: 48px;
        margin: 0 2px 2px 1px;
        border: 2px solid #353525;
        DOTAItemImage {
            width: 60px;
            height: 48px;
            z-index: 0;

            tooltip-position: top;
        }
    }
    .draggingFrom {
        border: 2px solid red;
    }

    .tryingToDrop {
        border: 2px solid #5e6e31;
    }

    .selected {
        border: 1px solid red;
    }
`;

interface ItemContainerProps {
    /** 是否是物品栏格子 */
    selectItem?: boolean;
    /** 是否是物品栏格子 */
    IsInventory?: boolean;
    /** 是否是棋子栏的格子 */
    IsChessSlot?: boolean;
    /** 格子拥有者的ID */
    UnitEntityIndex: EntityIndex;
    /** 格子的序号 */
    SlotIndex?: number;
    /** 物品序列号 */
    ItemEntityIndex?: AbilityEntityIndex;
    OnActivate?: (itemEntityIndex: number) => void;
    OnDblclick?: (itemEntityIndex: number) => void;
}

/**
 * 单个物品
 */
function InventoryItem(props: ItemContainerProps) {
    const [selected, setToggleSelected] = createSignal(false);
    const GetItemName = () => Abilities.GetAbilityName(props.ItemEntityIndex!);
    const ShowItemTooltip = (panel: Panel) => {};
    const HideItemTooltip = () => {};
    /**
     * 开始拖动
     */
    const OnDragStart = (panel: Panel, dragCallbacks: IDragCallbacks) => {
        //没有装备就不往下走
        if (props.ItemEntityIndex! < 0) return true;
        if (selected()) {
            setToggleSelected(false);
        }
        HideItemTooltip();
        let displayPanel = $.CreatePanel(
            'DOTAItemImage',
            $.GetContextPanel(),
            'dragImage'
        );
        displayPanel.itemname = GetItemName();
        displayPanel.SetAttributeInt('ItemEntityIndex', props.ItemEntityIndex!);
        displayPanel.SetAttributeInt('OwnerEntityIndex', props.UnitEntityIndex);
        displayPanel.SetAttributeInt('b_dragComplete', 0);
        dragCallbacks.displayPanel = displayPanel;
        dragCallbacks.offsetX = 30;
        dragCallbacks.offsetY = 22;
        panel.AddClass('draggingFrom');
        return true;
    };

    /**
     * 结束拖动
     */
    const OnDragEnd = (panel: Panel, draggedPanel: Panel) => {
        //删除左上角产生的拖动副本
        draggedPanel.DeleteAsync(0);
        panel.RemoveClass('draggingFrom');
        panel.RemoveClass('tryingToDrop');
        let b_dragComplete = Boolean(
            draggedPanel.GetAttributeInt('b_dragComplete', 0)
        );
        let OwnerEntityIndex = draggedPanel.GetAttributeInt(
            'OwnerEntityIndex',
            0
        ) as EntityIndex;
        let ItemEntityIndex = draggedPanel.GetAttributeInt(
            'ItemEntityIndex',
            0
        ) as AbilityEntityIndex;
        if (!b_dragComplete) {
            const target = 0;
            if (target > 0) {
                // 如果有目标
                if (Entities.IsRealHero(OwnerEntityIndex)) {
                    // 如果是从英雄给棋子，让英雄过去给
                    let order = {
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
                        TargetIndex: target,
                        AbilityIndex: ItemEntityIndex!
                    };
                    Game.PrepareUnitOrders(order);
                }
                return true;
            } else {
                // 如果没目标，则代表丢弃
                if (Entities.IsRealHero(OwnerEntityIndex)) {
                    Game.DropItemAtCursor(
                        OwnerEntityIndex,
                        ItemEntityIndex as ItemEntityIndex
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
        panel.AddClass('tryingToDrop');
        return true;
    };

    const OnDragLeave = (panel: Panel, draggedPanel: any) => {
        let draggedItem = draggedPanel.itemname;
        if (draggedItem == null || draggedPanel == panel) {
            return true;
        }
        panel.RemoveClass('tryingToDrop');
        return true;
    };

    /**
     * 丢到某个格子里面
     */
    const OnDragDrop = (panel: Panel, draggedPanel: Panel) => {
        let b_dragComplete = Boolean(
            draggedPanel.GetAttributeInt('b_dragComplete', 0)
        );
        let OwnerEntityIndex = draggedPanel.GetAttributeInt(
            'OwnerEntityIndex',
            0
        ) as EntityIndex;
        let ItemEntityIndex = draggedPanel.GetAttributeInt(
            'ItemEntityIndex',
            0
        ) as AbilityEntityIndex;
        let draggedItem = ItemEntityIndex;
        if (draggedItem == null) return true;
        draggedPanel.SetAttributeInt('b_dragComplete', 1);

        if (OwnerEntityIndex == props.UnitEntityIndex) {
            // 自己交换
            const swapOrder = {
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
                TargetIndex: props.SlotIndex,
                AbilityIndex: draggedItem
            };
            Game.PrepareUnitOrders(swapOrder);
        } else {
            // 给别人
            if (Entities.IsRealHero(OwnerEntityIndex)) {
                // 如果是从英雄给棋子，让英雄过去给
                let order = {
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
                    TargetIndex: props.UnitEntityIndex,
                    AbilityIndex: ItemEntityIndex!
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
            className={`inventoryItem `}
            draggable={true}
            onDragStart={OnDragStart}
            onDragEnd={OnDragEnd}
            onDragEnter={OnDragEnter}
            onDragLeave={OnDragLeave}
            onDragDrop={OnDragDrop}
            onmouseover={ShowItemTooltip}
            onmouseout={HideItemTooltip}
            onactivate={() => {
                if (GameUI.IsAltDown()) {
                    Abilities.PingAbility(props.ItemEntityIndex!);
                } else {
                    Abilities.ExecuteAbility(
                        props.ItemEntityIndex!,
                        Players.GetLocalPlayerPortraitUnit(),
                        false
                    );
                }
            }}
            ondblclick={() => {
                Abilities.CreateDoubleTapCastOrder(
                    props.ItemEntityIndex!,
                    Players.GetLocalPlayerPortraitUnit()
                );
            }}
        >
            <DOTAItemImage
                itemname={Abilities.GetAbilityName(props.ItemEntityIndex!)}
            />
        </Panel>
    );
}

/**
 * 物品列表
 */
function getItemList() {
    let items = [];
    for (let slot = 0; slot < 9; ++slot) {
        items.push(
            Entities.GetItemInSlot(Players.GetLocalPlayerPortraitUnit(), slot)
        );
    }
    return items;
}

/**
 * 物品栏
 */
function Inventory() {
    const [itemList, setItemList] = createSignal<ItemEntityIndex[]>(
        getItemList()
    );
    //调用事件监听
    useGameEvent('dota_inventory_changed', () => {
        setItemList(getItemList());
    });
    //更新当前的装备栏
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
}

export default Inventory;
