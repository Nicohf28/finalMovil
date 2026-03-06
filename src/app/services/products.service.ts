import { Injectable } from '@angular/core';
import { Product } from '../models/product';

const BAKERY_PRODUCTS: Product[] = [
  { id: '1', name: 'Pastel de chocolate', price: 12000, description: 'Porción individual' },
  { id: '2', name: 'Croissant', price: 3500, description: 'Mantequilla recién horneado' },
  { id: '3', name: 'Torta de zanahoria', price: 15000, description: 'Porción con nueces' },
  { id: '4', name: 'Brownie', price: 4500, description: 'Con nueces y chips' },
  { id: '5', name: 'Muffin de arándanos', price: 4000, description: 'Esponjoso' },
  { id: '6', name: 'Cheesecake', price: 14000, description: 'Porción fría' },
  { id: '7', name: 'Pan de canela', price: 5000, description: 'Rollito glaseado' },
  { id: '8', name: 'Galleta de avena', price: 2500, description: 'Pack x3' },
  { id: '9', name: 'Tarta de frutas', price: 13000, description: 'Estacional' },
  { id: '10', name: 'Café + pastel', price: 8000, description: 'Combo del día' },
];

@Injectable({ providedIn: 'root' })
export class ProductsService {
  getProducts(): Product[] {
    return [...BAKERY_PRODUCTS];
  }

  getProductById(id: string): Product | undefined {
    return BAKERY_PRODUCTS.find((p) => p.id === id);
  }
}
