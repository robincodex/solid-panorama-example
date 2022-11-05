
const root = $.GetContextPanel();
const modules = GameUI.__modules = {}
GameUI.__loadModule = function (name, exports) {
    if (modules[name]) {
        $.Msg(`Reload module: ${name} `, exports ? '👏' : '☠️')
    }
    modules[name] = exports
}
GameUI.__require = function (name) {
    name = name.slice(2, name.length-3);
    if (!modules[name]) {
        const m = $.CreatePanel('Panel', root, name)
        m.BLoadLayout(`file://{resources}/layout/custom_game/${name}.xml`, false, false);
        $.Msg(`Load module: ${name} `, modules[name] ? '👏' : '☠️')
    }
    return modules[name]
}