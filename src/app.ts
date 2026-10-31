import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import productRoutes from './routes/productRoutes';

type HttpError = Error & { type?: string };

const app = express();

app.use(express.json());
app.use('/products', productRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Body JSON tidak valid' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

export default app;
