import mongoose from 'mongoose';

let db;

mongoose.Promise = global.Promise;

const getAppUrl = (env) => {
  let appUrl;
  switch (env) {
    case 'test':
      appUrl = 'APP_URL_TEST';
      break;
    case 'production':
      appUrl = 'APP_URL_PROD';
      break;
    default:
      appUrl = 'APP_URL_DEV';
  }
  console.log('------', process.env[appUrl]);
  return process.env[appUrl];
};

const connect = async () => {
  const database = await mongoose.connect(getAppUrl(process.env.NODE_ENV), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to a mongo instance');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
  });

  db = database;
  return 'connected';
};

export const getDb = () => db;

export default connect;
