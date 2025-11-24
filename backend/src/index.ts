import dotenv from 'dotenv';
import { env } from "./config/env.js";
import app from './app.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT} in ${env.NODE_ENV} mode`);
});