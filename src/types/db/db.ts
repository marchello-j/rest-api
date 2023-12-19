import { BlogModel } from '../blog/output';
import { VideoType } from '../video/output';
import { PostModel } from '../post/output';

export type DBType = {
	blogs: BlogModel[];
	posts: PostModel[];
	videos: VideoType[];
};
