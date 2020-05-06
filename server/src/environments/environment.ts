export const environment = {
    production: false,
    mongo: {
        url: process.env.MONGO_URL || 'http://localhost:27017/anotherplanningtool',
        options: {
            useNewUrlParser: true,
        },
    },
};