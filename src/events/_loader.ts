import { resolve } from 'path';

import glob from 'glob';

const loadEventSystem = () => {
    const basePath = resolve(__dirname, '.');
    const files = glob.sync('*.js', { cwd: basePath });
    files.forEach((file) => {
        if (file.toLocaleLowerCase().includes('_config')) return;
        require(resolve(basePath, file));
    });
};

export default loadEventSystem;
