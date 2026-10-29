import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import productsRoute from './routes/products.routes.js'
import mediaForPage from './routes/mediaForPage.route.js'
import mediaForHomePage from './routes/mediaForHomePage.route.js'
import authRoutes from './routes/authRoutes.route.js'
import adminAuthRoutes from './routes/adminAuth.routes.js'
import path from 'path';
import { Navs, Parts } from './constants.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    'https://ralph-lauren-app-aing-hd1fobxdg.vercel.app',
     process.env.FRONTEND_URL],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use('/products', express.static(path.join(process.cwd(), "Products",)));
app.use('/mediaforhome', express.static(path.join(process.cwd(), "MediaForHome")));
Navs.map((nav) => {
  Parts.map((part) => {
    return app.use('/media', express.static(path.join(process.cwd(), "MediaForPage", nav, part)));
  })
})





app.use('/api/products', productsRoute);
app.use('/api/mediaforpage', mediaForPage);
app.use('/api/landingPage',mediaForHomePage);


app.use('/api/auth', authRoutes)


app.use('/api/admin', adminAuthRoutes)



app.get("/api/check", (req,res) => {
  res.status(200).json({
    success: true,
    message: "success"
  })
})



export default app;

