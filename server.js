import express from 'express';
import dotenv from 'dotenv';
import bootcamp_routes from './routes/bootcamps.js';
import courses_routes from './routes/courses.js';
import morgan from 'morgan';
import { connect_db } from './config/db.js';
import colors from 'colors';
import qs from 'qs';
import fileUpload from 'express-fileupload';
import path from 'path';
import user_routes from './routes/users.js';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import review_routes from './routes/reviews.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import xss from 'xss-clean'
import { rateLimit } from 'express-rate-limit'
import hpp from 'hpp';
import cors from 'cors'
dotenv.config();

const __dirname = path.resolve();
const app = express();

app.set('query parser', str => qs.parse(str));
app.use(express.json());

connect_db();

// Logging
app.use(morgan('dev'));

// File upload
app.use(fileUpload());

//Cookie parser
app.use(cookieParser())

//Sanitize data
app.use(ExpressMongoSanitize())

//Set security headers
app.use(helmet())

//Prevent XSS attacks
app.use(xss())

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,

})

app.use(limiter)

//Prevent http param polution
app.use(hpp())

app.use(cors())

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/bootcamps', bootcamp_routes);
app.use('/api/courses', courses_routes);
app.use('/api/users', user_routes)
app.use('/api/reviews', review_routes)

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green)
);
