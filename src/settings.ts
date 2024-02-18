import express from 'express';

// import { videoRoute } from './routes/video-route';
import {blogRoute} from './routes/blog-route';
import {postRoute} from './routes/post-route';
import {usersRoute} from './routes/users-route';
import {deleteAllDataRoute} from './routes/testing-route';
import {authRouter} from './routes/auth-router';

export const app = express();
app.use(express.json());
export const RouterPaths = {
  blogs: '/blogs',
  posts: '/posts',
  users: '/users',
  auth: '/auth',
  test: '/testing/all-data'
}
app.use(RouterPaths.test, deleteAllDataRoute);
app.use(RouterPaths.blogs, blogRoute);
app.use(RouterPaths.posts, postRoute);
app.use(RouterPaths.users, usersRoute);
app.use(RouterPaths.auth, authRouter);
