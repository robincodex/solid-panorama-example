import {
    Accessor,
    batch,
    createEffect,
    createSignal,
    For,
    Index,
    onMount
} from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { useGameEvent } from 'solid-panorama-all-in-jsx/events.macro';
import { CButton } from './Button';
import difference from 'lodash/difference';
import { UpdateList } from './utils';

const AbilityStyle = css`
    margin: 5px;
    flow-children: down;
    overflow: noclip;

    .AbilityImageWrapper {
        box-shadow: #000 0px 0px 5px;
        overflow: noclip;
    }

    .AbilityImageWrapper,
    DOTAAbilityImage {
        width: 64px;
        height: 64px;
    }

    .LearnButton {
        width: 100%;
        height: 15px;
        background-color: #ffc800;
        opacity: 0;
        background-image: url('s2r://panorama/images/control_icons/plus_png.vtex');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 15px 15px;
    }

    .AbilityBorder {
        width: 100%;
        height: 100%;
        border: 2px solid #999999;
    }

    .AbilityCooldown {
        width: 100%;
        height: 100%;
        background-color: #2d2d2de0;
    }

    .HotKey {
        min-width: 20px;
        color: #ffffff;
        font-family: RadianceM;
        padding: 2px;
        background-color: #222222;
        border: 1px solid #000000;
        border-radius: 5px;
        font-size: 14px;
        transform: translate3d(-5px, -5px, 0px);
        text-align: center;
    }

    .Mana {
        horizontal-align: right;
        vertical-align: bottom;
        color: #00b3ff;
        font-family: RadianceM;
        padding: 2px;
        text-shadow: #000000 0px 0px 2px 4;
    }

    .AbilityLevel {
        flow-children: right;
        horizontal-align: center;
        margin-top: 2px;
        .Level {
            width: 13px;
            height: 5px;
            margin: 2px;
            background-color: #00000099;
            &.IsActivate {
                background-color: #ffc800;
            }
        }
    }

    &.IsPassive {
        .AbilityBorder {
            border: 0px;
            box-shadow: inset #000 0px 0px 5px;
        }
    }
    &.IsNotActive {
        DOTAAbilityImage {
            wash-color: #555555;
            saturation: 0.5;
        }
    }
    &.CanLearn {
        .LearnButton {
            opacity: 1;
        }
    }
`;

function Ability(props: { slot: number; list: AbilityList }) {
    const [ability, setAbility] = createSignal(-1 as AbilityEntityIndex);
    const [isPassive, setIsPassive] = createSignal(false);
    const [isNotActive, setIsNotActive] = createSignal(false);
    const [canLearn, setCanLearn] = createSignal(false);
    const [maxLevel, setMaxLevel] = createSignal<boolean[]>([]);
    let AbilityCooldown: Panel | undefined;

    onMount(() => {
        function updateState() {
            const currentAbility =
                props.list.value(props.slot) || (-1 as AbilityEntityIndex);
            const _maxLevel = Math.max(
                0,
                Abilities.GetMaxLevel(currentAbility)
            );
            const level = Abilities.GetLevel(currentAbility);
            setAbility(currentAbility);
            setIsPassive(Abilities.IsPassive(currentAbility));
            setIsNotActive(
                !Abilities.IsActivated(currentAbility) ||
                    Abilities.GetLevel(currentAbility) <= 0
            );
            setCanLearn(
                Entities.GetAbilityPoints(Abilities.GetCaster(currentAbility)) >
                    0 &&
                    Abilities.CanAbilityBeUpgraded(currentAbility) ===
                        AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED
            );

            // Update level state
            if (maxLevel().length !== _maxLevel) {
                const list: boolean[] = [];
                for (let i = 0; i < _maxLevel; i++) {
                    list.push(i < level);
                }
                setMaxLevel(list);
            } else {
                const list = maxLevel();
                let updateLevel = false;
                for (let i = 0; i < _maxLevel; i++) {
                    const enabled = i < level;
                    if (list[i] !== enabled) {
                        list[i] = enabled;
                        updateLevel = true;
                    }
                }
                if (updateLevel) {
                    setMaxLevel([...list]);
                }
            }
        }

        let cooldownTimer = 0;
        function updateCooldown() {
            if (Abilities.IsCooldownReady(ability())) {
                if (cooldownTimer !== 0) {
                    clearInterval(cooldownTimer);
                    cooldownTimer = 0;
                }
                AbilityCooldown!.visible = false;
            } else if (cooldownTimer === 0) {
                cooldownTimer = setInterval(() => {
                    const time = Abilities.GetCooldownTime(ability());
                    let percent = time / Abilities.GetCooldownLength(ability());
                    if (isNaN(percent) || percent === Infinity) {
                        percent = 0;
                    }
                    AbilityCooldown!.style.clip = `radial(50% 50%, 0deg, ${
                        percent * -360
                    }deg)`;
                    AbilityCooldown!.visible = true;
                }, 0);
            }
        }

        setInterval(() => {
            batch(updateState);
            updateCooldown();
        }, 200);
    });

    return (
        <Panel
            class={AbilityStyle}
            visible={ability() > 0}
            classList={{
                IsPassive: isPassive(),
                IsNotActive: isNotActive(),
                CanLearn: canLearn()
            }}
        >
            <Panel
                class="LearnButton"
                onactivate={() => {
                    Abilities.AttemptToUpgrade(ability());
                }}
            />
            <Panel
                class="AbilityImageWrapper"
                hittestchildren={false}
                onactivate={() => {
                    if (GameUI.IsAltDown()) {
                        Abilities.PingAbility(ability());
                    } else {
                        Abilities.ExecuteAbility(
                            ability(),
                            Players.GetLocalPlayerPortraitUnit(),
                            false
                        );
                    }
                }}
                onmouseover={selfPanel => {
                    $.DispatchEvent(
                        'DOTAShowAbilityTooltipForEntityIndex',
                        selfPanel,
                        Abilities.GetAbilityName(ability()),
                        Players.GetLocalPlayerPortraitUnit()
                    );
                }}
                onmouseout={selfPanel => {
                    $.DispatchEvent('DOTAHideAbilityTooltip', selfPanel);
                }}
            >
                <DOTAAbilityImage contextEntityIndex={ability()} />
                <Panel
                    class="AbilityCooldown"
                    visible={false}
                    ref={AbilityCooldown}
                />
                <Panel class="AbilityBorder" />
                <Label
                    class="HotKey"
                    visible={!isPassive()}
                    text={Abilities.GetKeybind(ability())}
                />
                <Label
                    class="Mana"
                    visible={Abilities.GetManaCost(ability()) > 0}
                    text={Abilities.GetManaCost(ability())}
                />
            </Panel>
            <Panel class="AbilityLevel">
                <Index each={maxLevel()}>
                    {enabled => {
                        return (
                            <Panel
                                class="Level"
                                className={enabled() ? 'IsActivate' : ''}
                            />
                        );
                    }}
                </Index>
            </Panel>
        </Panel>
    );
}

const DotaAbilitiesStyle = css`
    flow-children: right;
`;

class AbilityList extends UpdateList<AbilityEntityIndex> {
    private _abilities: AbilityEntityIndex[] = [];

    next(index: number): boolean {
        return !!this._abilities[index];
    }

    updateFromUnit(unit: EntityIndex): boolean {
        const abilities = this._abilities;
        if (!Entities.IsValidEntity(unit)) {
            if (abilities.length > 0) {
                abilities.splice(abilities.length);
                return true;
            }
            return false;
        }
        const count = Entities.GetAbilityCount(unit);
        let lastIndex = 0;
        let update = false;
        for (let i = 0; i < count; i++) {
            const ability = Entities.GetAbility(unit, i);
            if (Entities.IsValidEntity(ability)) {
                if (
                    Abilities.IsHidden(ability) ||
                    Abilities.IsAttributeBonus(ability) ||
                    Abilities.GetAbilityType(ability) ===
                        ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES
                ) {
                    abilities[i] = -1 as AbilityEntityIndex;
                    continue;
                }
                if (abilities[i] !== ability) {
                    abilities[i] = ability;
                    update = true;
                }
                lastIndex = i;
            } else {
                abilities[i] = -1 as AbilityEntityIndex;
            }
        }
        if (update) {
            abilities.splice(lastIndex + 1, abilities.length - lastIndex);
            super.update();
        }
        return update;
    }

    value(index: number): AbilityEntityIndex | undefined {
        return this._abilities[index];
    }

    public static Create(): [
        Accessor<number[]>,
        (unit: EntityIndex) => void,
        AbilityList
    ] {
        const [list, setList] = createSignal<number[]>([]);
        const abilities = new AbilityList();

        function updater(unit: EntityIndex) {
            if (abilities.updateFromUnit(unit)) {
                setList([...abilities.indexes]);
            }
        }

        return [list, updater, abilities];
    }
}

export function DotaAbilities() {
    let unit = Players.GetLocalPlayerPortraitUnit();
    const [list, updater, abilities] = AbilityList.Create();

    useGameEvent('dota_player_update_query_unit', evt => {
        unit = Players.GetLocalPlayerPortraitUnit();
    });
    useGameEvent('dota_player_update_selected_unit', evt => {
        unit = Players.GetLocalPlayerPortraitUnit();
    });

    onMount(() => {
        setInterval(() => {
            updater(unit);
        }, 200);
    });

    return (
        <Panel class={DotaAbilitiesStyle}>
            <For each={list()}>
                {i => <Ability slot={i} list={abilities} />}
            </For>
        </Panel>
    );
}
