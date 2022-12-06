/*
 * @Author: du 1149464651@qq.com
 * @Date: 2022-12-03 16:15:30
 * @LastEditors: du 1149464651@qq.com
 * @LastEditTime: 2022-12-04 00:49:21
 * @FilePath: \solid-panorama-example\src\shop\shop.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    createEffect,
    createSignal,
    Index,
    onCleanup,
    onMount,
    ParentComponent
} from 'solid-js';
import { render } from 'solid-panorama-runtime';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { CButton } from '../components/Button';
import EquipItemSlot from '../components/EquipItem';

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/shop.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
            <include src="file://{resources}/scripts/custom_game/shop.js" />
        </scripts>
        <Panel class="root" hittest={false}>
            <Panel id="app" />
        </Panel>
    </root>
);

const rootStyle = css`
margin: 100px 100px;
    flow-children: right;
    horizontal-align: center;
    vertical-align: bottom;
`;
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

function App() {
    const [itemList, setItemList] = createSignal<ItemEntityIndex[]>(
        getItemList()
    );
    //调用原生事件监听
    let id = GameEvents.Subscribe('dota_inventory_changed', () => {
        setItemList(getItemList());
    });
    onCleanup(() => GameEvents.Unsubscribe(id));

    //更新当前的装备栏
    const Update = () => {
        setItemList(getItemList());
    };
    const timer = setInterval(Update, Game.GetGameFrameTime());
    onCleanup(() => clearInterval(timer));
    return (
        <Panel class={rootStyle}>
            {/* <CButton text="Button A" small /> */}

            <Index each={[...Array(9).keys()]}>
                {slot => (
                    <EquipItemSlot
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

render(() => <App />, $('#app'));
