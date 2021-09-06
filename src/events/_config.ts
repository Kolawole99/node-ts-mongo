import EventEmitter from 'events';
import { Logger } from '../utilities/logger';

class AppEvent extends EventEmitter {}
const appEvent = new AppEvent();

export default appEvent.on('error', (error) => {
    Logger.error(`[AppEvent Error] ${error as string}`);
});
