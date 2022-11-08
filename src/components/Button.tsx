interface btnProps {
    icon?: string;
    text?: string;
}

export function CButton({ text, icon }: btnProps) {
    return (
        <Button>
            <Image
                src={icon ? `file://{images}/custom_game/${icon}` : ''}
                visible={!!icon}
            />
            <Label text={text} visible={!!text} />
        </Button>
    );
}
