import { createEffect } from 'solid-js';

export function useTimer(
    firstDelay: number,
    callback: () => number | undefined,
    deps?: any
): void;
export function useTimer(callback: () => number | undefined, deps?: any): void;
export function useTimer(...args: any[]): void {
    let firstDelay = 0;
    let callback: () => number | undefined;
    let deps;
    if (args.length === 2) {
        firstDelay = args[0];
        callback = args[1];
        deps = args[2];
    } else {
        callback = args[0];
        deps = args[1];
    }

    createEffect(() => {
        let t: ScheduleID;
        const running = () => {
            const next = callback();
            if (next) {
                t = $.Schedule(next, running);
            }
        };
        t = $.Schedule(firstDelay, running);
        return () => {
            try {
                $.CancelScheduled(t);
            } catch (e) {}
        };
    });
}
