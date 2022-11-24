import { createEffect, createSignal, For, onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { useGameEvent } from 'solid-panorama-runtime';
import { CButton } from './Button';
import difference from 'lodash/difference';

const AbilityStyle = css`
    width: 64px;
    height: 64px;
    margin: 5px;
    box-shadow: #000 0px 0px 5px;

    DOTAAbilityImage {
        width: 100%;
        height: 100%;
    }

    .AbilityBorder {
        width: 100%;
        height: 100%;
        border: 2px solid #999999;
    }

    .HotKey {
        horizontal-align: center;
        vertical-align: bottom;
        color: #ffffff;
        font-family: RadianceM;
        padding: 2px;
        text-shadow: #000000 0px 0px 2px 3;
    }

    &.IsPassive {
        .AbilityBorder {
            border: 0px;
            box-shadow: inset #000 0px 0px 5px;
        }
    }
    &.IsNotActive {
        DOTAAbilityImage {
            wash-color: #999999;
            saturation: 0.5;
        }
    }
`;

function Ability(props: { ability: AbilityEntityIndex }) {
    return (
        <Panel
            class={AbilityStyle}
            classList={{
                IsPassive: Abilities.IsPassive(props.ability),
                IsNotActive:
                    !Abilities.IsActivated(props.ability) ||
                    Abilities.GetLevel(props.ability) <= 0
            }}
        >
            <DOTAAbilityImage contextEntityIndex={props.ability} />
            <Panel class="AbilityBorder" />
            <Label class="HotKey" text={Abilities.GetKeybind(props.ability)} />
        </Panel>
    );
}

const DotaAbilitiesStyle = css`
    flow-children: right;
`;

export function DotaAbilities() {
    const [unit, setUnit] = createSignal(Players.GetLocalPlayerPortraitUnit());
    const [abilities, setAbilities] = createSignal<AbilityEntityIndex[]>([]);

    useGameEvent(
        'dota_player_update_query_unit',
        evt => {
            setUnit(Players.GetLocalPlayerPortraitUnit());
        },
        unit()
    );
    useGameEvent(
        'dota_player_update_selected_unit',
        evt => {
            setUnit(Players.GetLocalPlayerPortraitUnit());
        },
        unit()
    );

    // Update abilities from unit
    function updateAbilities() {
        const currentUnit = unit();
        if (currentUnit < 0) {
            if (abilities().length > 0) {
                setAbilities([]);
            }
            return;
        }
        const list: AbilityEntityIndex[] = [];
        const count = Entities.GetAbilityCount(currentUnit);
        for (let i = 0; i < count; i++) {
            const ability = Entities.GetAbility(currentUnit, i);
            if (Entities.IsValidEntity(ability)) {
                if (
                    Abilities.IsHidden(ability) ||
                    Abilities.IsAttributeBonus(ability) ||
                    Abilities.GetAbilityType(ability) ===
                        ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES
                ) {
                    continue;
                }
                list.push(ability);
            }
        }
        if (abilities().length <= 0) {
            setAbilities(list);
        } else if (difference(abilities(), list).length > 0) {
            setAbilities([...list]);
        }
    }

    createEffect(() => {
        updateAbilities();
    }, unit());

    onMount(() => {
        setInterval(() => {
            updateAbilities();
        }, 200);
    });

    return (
        <Panel class={DotaAbilitiesStyle}>
            <For each={abilities()}>
                {ability => <Ability ability={ability} />}
            </For>
        </Panel>
    );
}
