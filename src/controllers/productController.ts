import type { Request, Response } from 'express';
import * as products from '../data/products';

export function listProducts(req: Request, res: Response): void {
  res.status(200).json(products.getAllProducts());
}

export function getProduct(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const product = Number.isInteger(id) ? products.getProductById(id) : undefined;

  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json(product);
}

export function createProduct(req: Request, res: Response): void {
  const input = (req.body ?? {}) as { name?: unknown; price?: unknown };
  const { name, price } = input;
  const errors: string[] = [];

  const nameValid = typeof name === 'string' && name.trim() !== '';
  const priceValid = typeof price === 'number' && Number.isFinite(price) && price >= 0;

  if (!nameValid) {
    errors.push('name wajib diisi berupa teks.');
  }

  if (!priceValid) {
    errors.push('price wajib berupa angka >= 0.');
  }

  if (!nameValid || !priceValid) {
    res.status(400).json({ message: 'Data produk tidak valid', errors });
    return;
  }

  const product = products.addProduct({ name: name.trim(), price });
  res.status(201).json(product);
}
