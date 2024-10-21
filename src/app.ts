import dotenv from 'dotenv';


dotenv.config()

import express from 'express';
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const app = express();

//midelware para poder leer json
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes)
app.use('/users', userRoutes)
//ApiRest user



export default app
