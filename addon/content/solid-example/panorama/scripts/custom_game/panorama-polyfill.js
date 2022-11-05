
(function (global) {
    if (!global.console) {
        global.console = {}
    }
    console.log = console.warn = console.info = function(...args) {
        $.Msg(args.map((v) => {
            if (typeof v === 'object') {
                return JSON.stringify(v)
            }
            return String(v)
        }).join(' '))
    }
})(this);