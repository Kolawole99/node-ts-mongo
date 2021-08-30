import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import loadEventSystem from './src/events/_loader';
import { connect, loadModels } from './src/models/_config';
import appRouteHandler from './src/routes/_config';
import { MorganProductionFormat, MorganDevelopmentFormat } from './src/utilities/logger';

const { NODE_ENV, APP_PORT } = process.env;

const app = express();

connect();
loadModels();
loadEventSystem();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(compression());
app.use(helmet());

if (NODE_ENV === 'DEVELOPMENT') {
    app.use(MorganDevelopmentFormat);
} else {
    app.use(MorganProductionFormat);
}

app.use('/', appRouteHandler);

const PORT: number = parseInt(<string>APP_PORT, 10);
app.listen(PORT, () => {
    if (NODE_ENV === 'DEVELOPMENT') {
        console.log(`👍 Development Server is running at http://localhost:${PORT}`);
    } else {
        console.log(`😃 We are LIVE on port ${PORT}. 👍`);
    }
});
