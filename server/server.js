import cors from 'cors';
import {createProductFolder, createHomeMediaFolder } from './src/createFolderForMedia.js'
import app from './src/app.js';
import { dbConnection } from './src/database/dbConnection.js';

const port = 4000;

app.use(cors());

createProductFolder();
createHomeMediaFolder();

app.listen(port, () => {
  console.log(`Port is running on ${port}`);
  dbConnection();
})