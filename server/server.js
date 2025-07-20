import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.text());

app.get('/bookings.csv', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '../bookings.csv'));
});

app.put('/bookings.csv', (req, res) => {
  console.log('Received PUT request for bookings.csv');
  fs.writeFile(path.join(__dirname, '../bookings.csv'), req.body, (err) => {
    if (err) {
      console.error('Error writing to bookings.csv:', err);
      return res.status(500).send('Error writing to bookings.csv');
    }
    console.log('Successfully wrote to bookings.csv');
    res.send('bookings.csv updated');
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});