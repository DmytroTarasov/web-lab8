import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import authRoutes from './routes/auth-routes.js';

mongoose.set('strictQuery', false);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use('/api', authRoutes);

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({
        message: error.message || 'An unknown error occured.'
    });
});

mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nhtjl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(process.env.PORT || 5000);
})
.catch(err => {
    console.log(err);
});