import { render } from 'solid-panorama-runtime';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { CButton } from '../components/Button';

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
    flow-children: right;
    horizontal-align: center;
    vertical-align: bottom;
`;

function App() {
    return (
        <Panel class={rootStyle}>
            <CButton text="Button A" small />
            <CButton text="Button B" />
            <CButton text="Button C" large />
        </Panel>
    );
}

render(() => <App />, $('#app'));
