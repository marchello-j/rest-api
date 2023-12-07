import { app } from './settings';

const port = 80;

app.listen(port, (): void => {
	console.log(`Listen on port ${port}`);
});
