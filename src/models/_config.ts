import { resolve } from 'path';

import mongoose from 'mongoose';
import glob from 'glob';

import { Logger } from '../utilities/logger';

const { APP_DB_URI } = process.env;

export function connect() {
    try {
        const options: {} = {
            autoIndex: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        mongoose.connect(
            `${APP_DB_URI}`,
            options,
            (error) => {
                if (error) {
                    Logger.error(`[Database Connection Error] ${error}`);
                    console.log('👎 Could not connect to database');
                    return;
                } else {
                    console.log('🔥 Database connection is established.');
                    return;
                }
            }
        );
    } catch (e: any) {
        console.log(`DB Error: ${e.message}`);
    }
};

export function loadModels() {
    const basePath = resolve(__dirname, '../models/');
    const files = glob.sync('*.js', { cwd: basePath });
    files.forEach((file) => {
        if (file.toLocaleLowerCase().includes('_config')) return;
        require(resolve(basePath, file));
    });
};
