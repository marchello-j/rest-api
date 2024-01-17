import express from 'express';

// import { videoRoute } from './routes/video-route';
import { blogRoute } from './routes/blog-route';
import { postRoute } from './routes/post-route';
import { usersRoute } from './routes/users-route';
import { deleteAllDataRoute } from './routes/testing-route';
import { authRouter } from './routes/auth-router';

export const app = express();
app.use(express.json());

app.use('/testing/all-data', deleteAllDataRoute);
app.use('/blogs', blogRoute);
app.use('/posts', postRoute);
app.use('/users', usersRoute);
app.use('/auth', authRouter);
