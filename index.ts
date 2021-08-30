import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import loadEventSystem  from './src/events/_loader';
import { connect, loadModels } from './src/models/_config';
import appRouteHandler from './src/routes/_config';
import { Morgan } from './src/utilities/logger'

const {NODE_ENV, APP_PORT} = process.env;

const app = express();

connect();
loadModels();
loadEventSystem();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(Morgan);

app.use('/', appRouteHandler);

app.listen(APP_PORT, () => {
    if (NODE_ENV === "DEVELOPMENT") {
        console.log(`👍 Development Server is running at http://localhost:${APP_PORT}`);
    } else {
        console.log(`😃 We are LIVE on port ${APP_PORT}`);
    }
});
