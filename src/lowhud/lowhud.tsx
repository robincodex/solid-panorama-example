import { createEffect, createSignal, onMount, ParentComponent } from 'solid-js';
import { render } from 'solid-panorama-runtime';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { DotaAbilities } from '../components/Ability';

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/lowhud.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
            <include src="file://{resources}/scripts/custom_game/lowhud.js" />
        </scripts>
        <Panel class="root" hittest={false}>
            <Panel id="app" class="root" />
        </Panel>
    </root>
);

css`
    .root {
        width: 100%;
        height: 100%;
    }
`;

const rootStyle = css`
    flow-children: down;
    horizontal-align: center;
    vertical-align: bottom;
`;

function App() {
    let root: Panel | undefined;

    onMount(() => {
        console.log('Created lowhud', rootStyle);
    });

    return (
        <Panel ref={root} class={rootStyle}>
            <DotaAbilities />
        </Panel>
    );
}

render(() => <App />, $('#app'));
