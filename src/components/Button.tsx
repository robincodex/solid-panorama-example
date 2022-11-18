import css from 'solid-panorama-all-in-jsx/css.macro';

interface btnProps {
    icon?: string;
    text?: string;
    color?: '' | 'R' | 'G' | 'B';
    small?: boolean;
    large?: boolean;
}

export function CButton({ text, icon, color, ...props }: btnProps) {
    const btnStyle = css`
        background-color: gradient(
            linear,
            0% 100%,
            0% 0%,
            from(#111111),
            to(#333333)
        );
        box-shadow: #000000 0px 0px 4px;
        padding: 10px 30px;

        Image {
            width: 20px;
            height: 20px;
        }

        Label {
            color: #ffffff;
            font-size: 16px;
            vertical-align: middle;
        }

        &.small {
            padding: 5px 15px;
            font-size: 12px;
        }

        &.large {
            padding: 20px 60px;
            font-size: 24px;
        }

        &.R {
            background-color: gradient(
                linear,
                0% 100%,
                0% 0%,
                from(#712222),
                to(#e70000)
            );
        }

        &.G {
            background-color: gradient(
                linear,
                0% 100%,
                0% 0%,
                from(#2f7122),
                to(#00e708)
            );
        }

        &.B {
            background-color: gradient(
                linear,
                0% 100%,
                0% 0%,
                from(#224471),
                to(#0083e7)
            );
        }
    `;

    return (
        <Button
            class="btnStyle"
            classList={{
                R: color === 'R',
                G: color === 'G',
                B: color === 'B',
                small: props.small === true,
                large: props.large === true
            }}
        >
            <Image
                src={icon ? `file://{images}/custom_game/${icon}` : ''}
                visible={!!icon}
            />
            <Label text={text} visible={!!text} />
        </Button>
    );
}
