# Bukti Pengujian

Tanggal: 31 Oktober 2026

Lingkungan:

- Windows
- Node.js v24.16.0
- npm 12.0.2
- Express 5.x
- TypeScript 7.x

Server dijalankan dengan `npm start` (melalui `tsx`) di `http://localhost:3000`, lalu setiap endpoint diuji dengan `curl.exe -i`.

## 1. GET /products (200)

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 76
ETag: W/"4c-uFXLLQbohGea6vnPxTWuWUbADdE"
Date: Sat, 31 Oct 2026 10:42:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"name":"Buku","price":15000},{"id":2,"name":"Pulpen","price":5000}]
```

Hasil: status `200` dan array seluruh produk sesuai data awal.

## 2. GET /products/1 (200)

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 36
ETag: W/"24-qMNdhLEbV6Y3h1NJ/n3ily5mAfU"
Date: Sat, 31 Oct 2026 10:42:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"name":"Buku","price":15000}
```

Hasil: status `200` dan objek produk Buku.

## 3. GET /products/999 (404)

```text
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 36
ETag: W/"24-cicTtLzLyeiBnP5wvhNQIuADZ2E"
Date: Sat, 31 Oct 2026 10:42:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Produk tidak ditemukan"}
```

Hasil: status `404` dan pesan JSON produk tidak ditemukan.

## 4. POST /products (201)

Perintah:

```bash
curl.exe -i -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name":"Penghapus","price":3000}'
```

```text
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 40
ETag: W/"28-c42bf+36E5N16L/cts6zRjcKGXs"
Date: Sat, 31 Oct 2026 10:42:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":3,"name":"Penghapus","price":3000}
```

Hasil: status `201`, ID baru `3`, dan data sesuai input.

## 5. POST /products dengan body tidak valid (400)

Perintah:

```bash
curl.exe -i -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name":"  ","price":-1}'
```

```text
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8

{"message":"Data produk tidak valid","errors":["name wajib diisi berupa teks.","price wajib berupa angka >= 0."]}
```

Hasil: status `400` dan daftar kesalahan validasi.

## 6. Hasil `npm test`

```text
✔ GET /products mengembalikan 200 dan seluruh produk (93.3216ms)
✔ GET /products/1 mengembalikan 200 dan produk Buku (17.6569ms)
✔ GET /products/999 mengembalikan 404 dan pesan produk tidak ditemukan (12.942ms)
✔ POST /products membuat produk baru dan mengembalikan 201 (88.3408ms)
✔ POST /products menolak body tidak valid dengan 400 (5.8301ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 935.9392
```

Semua 5 test lulus.
