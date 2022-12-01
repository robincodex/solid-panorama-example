import { createEffect } from 'solid-js';

export interface IUpdateList<T> {
    next(index: number): boolean;
    get length(): number;
    get indexes(): number[];
    update(): void;
    value(index: number): T | undefined;
    get values(): T[];
}

export class UpdateList<T> implements IUpdateList<T> {
    private _indexes: number[] = [];

    next(index: number): boolean {
        return false;
    }

    get length(): number {
        return this._indexes.length;
    }

    get indexes(): number[] {
        return this._indexes;
    }

    update(): void {
        let index = 0;
        let indexes = this._indexes;
        let len = indexes.length;
        while (this.next(index)) {
            if (index >= len) {
                indexes.push(index);
            }
            index++;
        }
    }

    value(index: number): T | undefined {
        return undefined;
    }

    get values(): T[] {
        return this._indexes.map(i => this.value(i)!);
    }
}
