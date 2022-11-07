import { createEffect, createSignal, onMount, ParentComponent } from 'solid-js';
import { render } from 'solid-panorama-runtime';
import xml from 'babel-plugin-panorama-all-in-jsx/xml.macro';

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/shop.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/shop.js" />
        </scripts>
        <Panel>
            <Panel id="app" />
        </Panel>
    </root>
);

function App() {
    return <Panel style={{ flowChildren: 'right' }}>Hello World!</Panel>;
}

render(() => <App />, $('#app'));
