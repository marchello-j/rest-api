import express, { Request, Response } from 'express';
import { videoRoute } from './routes/video-route';
import { blogRoute } from './routes/blog-route';
import { postRoute } from './routes/post-route';

export const app = express();
app.use(express.json());

app.use('/videos', videoRoute);
app.use('/blogs', blogRoute);
app.use('/posts', postRoute);
