import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';

import app from '../src/app';
import { resetProducts, type Product } from '../src/data/products';

let server: Server;
let baseUrl = '';

before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });

  const address = server.address();

  if (address === null || typeof address === 'string') {
    throw new Error('Alamat server tidak valid');
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

beforeEach(() => {
  resetProducts();
});

test('GET /products mengembalikan 200 dan seluruh produk', async () => {
  const response = await fetch(`${baseUrl}/products`);
  const body = (await response.json()) as Product[];

  assert.equal(response.status, 200);
  assert.deepEqual(body, [
    { id: 1, name: 'Buku', price: 15000 },
    { id: 2, name: 'Pulpen', price: 5000 },
  ]);
});

test('GET /products/1 mengembalikan 200 dan produk Buku', async () => {
  const response = await fetch(`${baseUrl}/products/1`);
  const body = (await response.json()) as Product;

  assert.equal(response.status, 200);
  assert.deepEqual(body, { id: 1, name: 'Buku', price: 15000 });
});

test('GET /products/999 mengembalikan 404 dan pesan produk tidak ditemukan', async () => {
  const response = await fetch(`${baseUrl}/products/999`);
  const body = (await response.json()) as { message: string };

  assert.equal(response.status, 404);
  assert.deepEqual(body, { message: 'Produk tidak ditemukan' });
});

test('POST /products membuat produk baru dan mengembalikan 201', async () => {
  const response = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Penghapus', price: 3000 }),
  });
  const body = (await response.json()) as Product;

  assert.equal(response.status, 201);
  assert.deepEqual(body, { id: 3, name: 'Penghapus', price: 3000 });

  const listResponse = await fetch(`${baseUrl}/products`);
  const listBody = (await listResponse.json()) as Product[];

  assert.equal(listBody.length, 3);
  assert.deepEqual(listBody[2], { id: 3, name: 'Penghapus', price: 3000 });
});

test('POST /products menolak body tidak valid dengan 400', async () => {
  const response = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '  ', price: -1 }),
  });
  const body = (await response.json()) as { message: string; errors: string[] };

  assert.equal(response.status, 400);
  assert.equal(body.message, 'Data produk tidak valid');
  assert.equal(body.errors.length, 2);
});
