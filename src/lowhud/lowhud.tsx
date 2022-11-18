import { createEffect, createSignal, onMount, ParentComponent } from 'solid-js';
import { render } from 'solid-panorama-runtime';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import { CButton } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import css from 'solid-panorama-all-in-jsx/css.macro';

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/hud_main.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/hud_main.js" />
        </scripts>
        <Panel>
            <Panel id="app" />
        </Panel>
    </root>
);

const rootStyle = css`
    flow-children: right;
    horizontal-align: center;
    vertical-align: bottom;
`;

function App() {
    return (
        <Panel class={rootStyle}>
            <ButtonGroup />
        </Panel>
    );
}

render(() => <App />, $('#app'));
