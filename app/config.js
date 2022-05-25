
const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://admin:61SXfDGmJBFQGCEc@parking.brxd9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  JwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;