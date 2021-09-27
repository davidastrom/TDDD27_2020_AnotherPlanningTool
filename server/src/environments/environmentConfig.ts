import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

export default {
	production: false,
	nodeEnv: process.env.NODE_ENV,
	sessionSecret: process.env.SESSION_SECRET || 'super secret',
	mongo: {
		url:
			process.env.MONGO_URL || 'mongodb://localhost:27017/anotherplanningtool',
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	auth: {
		jwt: {
			secret: process.env.JWT_SECRET || 'super secret',
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
	},
	https: {
		key: process.env.HTTPS_KEY || '',
		cert: process.env.HTTPS_CERT || '',
	},
};
