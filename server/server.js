const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connected successfully!'));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});
