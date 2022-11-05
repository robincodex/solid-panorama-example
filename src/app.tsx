import { createEffect, createSignal, onMount, ParentComponent } from 'solid-js';
import { render } from 'solid-panorama-runtime';

function Item(props: { show: boolean }) {
    let [root, setRoot] = createSignal<Panel | null>(null);
    let [text, setText] = createSignal('');
    let el: Panel | undefined;

    onMount(() => {
        $.Msg('onMount ', el);
    });

    createEffect(() => {
        $.Msg('effect root ', root());
    }, root);

    return (
        <Panel id="root" ref={el}>
            <Label text={text()} />
        </Panel>
    );
}

function HelloWorld() {
    return (
        <Panel style={{ flowChildren: 'right' }}>
            Hello World!
            <Item show />
        </Panel>
    );
}

render(() => <HelloWorld />, $('#app'));
