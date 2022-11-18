import css from 'solid-panorama-all-in-jsx/css.macro';
import { CButton } from './Button';

export function ButtonGroup() {
    const style = css`
        flow-children: right;
    `;
    return (
        <Panel class={style}>
            <CButton color="R" />
            <CButton color="G" />
            <CButton color="B" />
        </Panel>
    );
}
