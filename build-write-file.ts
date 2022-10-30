import fs, { promises } from 'fs';

const w = promises.writeFile;
const r = promises.readFile;
// @ts-ignore
const ww: typeof w = async function (file, data, options): Promise<void> {
    try {
        const content = await r(file, options);
        if (typeof content === 'string') {
            if (content === data) {
                return;
            }
        } else if (Buffer.isBuffer(content)) {
            if (
                content.equals(
                    Buffer.isBuffer(data) ? data : Buffer.from(data as string)
                )
            ) {
                return;
            }
        }
    } catch (err) {}
    await w(file, data, options);
};
promises.writeFile = ww;
