import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use('/server/auth', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}` );
});