import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import signupRoutes from './routes/signupRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import forgetPasswordRoutes from './routes/forgetPasswordRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import profileRoutes from './routes/profileRoutes.js'; 
import './db/database.js'; // Initialize LokiJS DB

const app = express();
const PORT = 1000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/forget-password', forgetPasswordRoutes);

app.use(errorHandler);

app.listen(PORT, () => 
  console.log(`Server running on http://localhost:${PORT}`)
);