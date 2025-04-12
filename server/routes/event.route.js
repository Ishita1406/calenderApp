import express from 'express';
import { createEvent, deleteEvent, editEvent, getAllEvents } from '../controllers/event.controller.js';
import { authenticateToken } from '../utils/authenticate.js';
import uploadMiddleware from '../middlewares/uploads.middleware.js';

const eventRouter = express.Router();

  eventRouter.post('/create', 
    authenticateToken,
    uploadMiddleware,
    createEvent
  );

  eventRouter.get('/get',
    authenticateToken,
    getAllEvents
  );

  eventRouter.delete('/delete/:id',
    authenticateToken,
    deleteEvent
  );

  eventRouter.put('/edit/:id',
    authenticateToken,
    uploadMiddleware,
    editEvent
  );

  
export default eventRouter;