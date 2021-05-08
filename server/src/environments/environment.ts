export const environment = {
    production: false,
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://mongo-database:27017/anotherplanningtool',
        options: {
            useNewUrlParser: true,
        },
    },
};