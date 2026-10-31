export interface Product {
  id: number;
  name: string;
  price: number;
}

export type NewProduct = Omit<Product, 'id'>;

const initialProducts: Product[] = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

let products: Product[] = initialProducts.map((product) => ({ ...product }));

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}

export function addProduct({ name, price }: NewProduct): Product {
  const nextId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
  const product: Product = { id: nextId, name, price };
  products.push(product);
  return product;
}

export function resetProducts(): void {
  products = initialProducts.map((product) => ({ ...product }));
}
