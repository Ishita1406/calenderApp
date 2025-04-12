import express from 'express';
import { createEvent } from '../controllers/event.controller.js';
import { authenticateToken } from '../utils/authenticate.js';
import uploadMiddleware from '../middlewares/uploads.middleware.js';

const eventRouter = express.Router();

  eventRouter.post('/create', 
    authenticateToken,
    uploadMiddleware,
    createEvent
  );

  
export default eventRouter;