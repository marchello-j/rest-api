import { runDB } from './db/db';
import { app } from './settings';

const port = 3030;

app.listen(port, async () => {
	await runDB();
});


