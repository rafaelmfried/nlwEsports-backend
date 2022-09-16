import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/games', (_request, response) => {
    return response.status(200).json([]);
  });

app.get('/games/:id/ads', (_request, response) => {
    return response.status(200).json([
      { id: 1, name: 'Anúncio 1' },
      { id: 2, name: 'Anúncio 2' },
      { id: 3, name: 'Anúncio 3' },
      { id: 4, name: 'Anúncio 4' },
      { id: 5, name: 'Anúncio 5' },
    ]);
  });

app.post('/ads', (_request, response) => {
    return response.status(201).json([]);
    });
  
app.get('/ads/:id/discord', (_request, response) => {
  return response.status(200).json([]);
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});