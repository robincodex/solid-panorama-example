/// <reference path="../node_modules/solid-panorama-polyfill/console.d.ts" />
/// <reference path="../node_modules/solid-panorama-polyfill/timers.d.ts" />

interface CustomGameEventDeclarations {
    custom_event_test: { test: number };
}

declare function useTimer(
    firstDelay: number,
    callback: () => number | undefined,
    deps?: any
): void;
declare function useTimer(callback: () => number | undefined, deps?: any): void;
