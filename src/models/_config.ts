import { resolve } from 'path';

import mongoose from 'mongoose';
import glob from 'glob';

import { Logger } from '../utilities/logger';

const { DB_URI, NODE_ENV } = process.env;

export function connect(): void {
    try {
        const options: Record<string, unknown> = {
            autoIndex: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        if (DB_URI) {
            mongoose.connect(DB_URI, options, (error) => {
                if (error) {
                    Logger.error(`[Database Connection Error] ${error as unknown as string}`);
                    console.log('🔴 Could not connect to database');
                    return;
                } else {
                    console.log('🟢 Database connection is established.');
                    return;
                }
            });
        } else {
            throw new Error('APP_DB_URI is not specified in Environment variables.');
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (NODE_ENV === 'DEVELOPMENT') {
                console.log(`DB Error: ${e.message}`);
            } else {
                Logger.error(`[DB Error: ] ${e.message}`);
            }
        }
    }
}

export function loadModels(): void {
    const basePath = resolve(__dirname, '../models/');
    const files: Array<string> = glob.sync('*.@(js|ts)', { cwd: basePath });
    files.forEach((file) => {
        if (file.toLocaleLowerCase().includes('_config')) return;
        require(resolve(basePath, file));
    });
}
