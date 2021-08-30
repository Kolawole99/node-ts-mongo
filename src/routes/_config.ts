const router = require('express').Router();

import { handle404, handleError, setupRequest, processResponse } from '../middlewares/http';
// import sampleRouteHandler from './sample';

router.use(setupRequest);
// router.use('/samples', sampleRouteHandler);
router.use(processResponse);

router.use('/image/:imageName', () => {});

router.use(handle404);
router.use(handleError);

export = router;
