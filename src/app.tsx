import { render } from '@solid-panorama/runtime';

function Item(props: { show: boolean }) {
    return (
        <Panel>
            <Label />
        </Panel>
    );
}

function HelloWorld() {
    return (
        <div>
            Hello World!
            <Item show />
        </div>
    );
}

render(() => <HelloWorld />, $('#app'));
