import { statSync } from 'fs';
import color from 'cli-color';

export function normalizedPath(p: string): string {
    return p.replace(/\\/g, '/');
}

export const Panorama = `[${color.magenta('Panorama')}]`;

export function fileColor(s: string) {
    return color.green(s);
}

export function isDir(p: string) {
    return statSync(p).isDirectory();
}
