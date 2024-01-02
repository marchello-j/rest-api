import express from 'express';

// import { videoRoute } from './routes/video-route';
import { blogRoute } from './routes/blog-route';
import { postRoute } from './routes/post-route';
import { deleteAllDataRoute } from './routes/testing-route';

export const app = express();
app.use(express.json());

app.use('/testing/all-data', deleteAllDataRoute);
app.use('/blogs', blogRoute);
app.use('/posts', postRoute);
