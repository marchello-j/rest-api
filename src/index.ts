import { runDB } from './db/db';
import { app } from './settings';

const port = 80;

app.listen(port, (): void => {
	runDB();
});
