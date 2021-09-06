import { resolve } from 'path';

import glob from 'glob';

const loadEventSystem = (): void => {
    const basePath = resolve(__dirname, '.');
    const files: Array<string> = glob.sync('*.@(js|ts)', { cwd: basePath });
    files.forEach((file) => {
        if (file.toLocaleLowerCase().includes('_config')) return;
        require(resolve(basePath, file));
    });
};

export default loadEventSystem;
