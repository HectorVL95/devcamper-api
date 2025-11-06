import express from 'express'
import dotenv from 'dotenv'
import bootcamp_routes from './routes/bootcamps.js';
import courses_routes from './routes/courses.js';
dotenv.config();
import morgan from 'morgan';
import { connect_db } from './config/db.js';
import colors from 'colors'
import qs from 'qs'
import fileUpload from 'express-fileupload';
import path from 'path'
const __dirname = path.resolve()

const app = express();

app.set('query parser', str => qs.parse(str))

app.use(express.json());

connect_db();

app.use(morgan());


app.use(fileUpload(path.join(__dirname, 'public')))

app.use(express.static())

app.use('/api/bootcamps', bootcamp_routes);
app.use('/api/courses', courses_routes);

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green));