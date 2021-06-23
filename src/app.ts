import { errors } from 'celebrate';
import path from 'path';
import express from 'express';
import routes from './routes';
import cors from 'cors';
const app = express();

require('dotenv').config();

app.use(cors());

const authOrigins = [
    String(process.env.REACT_APP_URL_FRONT), 
    String(process.env.REACT_APP_URL_FRONT_MOBILE)
]

app.all('/*', function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '200mb' }));
app.use(routes);
app.use('/classes/uploads', express.static(path.resolve(__dirname, '..','uploads')));
app.use('/log', express.static(path.resolve(__dirname, 'logs','global')));

app.use(errors());

export default app;