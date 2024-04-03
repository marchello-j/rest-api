export const envSetting = {
	MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
	JWT_SECRET: process.env.JWT_SECRET || '123',
	EMAIL_SENDER: process.env.EMAIL_SENDER || undefined,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}
