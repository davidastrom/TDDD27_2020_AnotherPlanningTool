import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

export const environment = {
  production: false,
  nodeEnv: process.env.NODE_ENV,
  mongo: {
    url:
      process.env.MONGO_URL || "mongodb://localhost:27017/anotherplanningtool",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || "super secret",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || null,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || null,
    },
  },
};
