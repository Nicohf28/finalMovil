import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';
import { OrderItem } from '../models/order';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);

  getItems() {
    return this.items$.asObservable();
  }

  getItemCount(): number {
    return this.items$.getValue().reduce((sum, i) => sum + i.quantity, 0);
  }

  getTotal(): number {
    return this.items$.getValue().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  addProduct(product: Product, quantity: number = 1) {
    const items = this.items$.getValue();
    const idx = items.findIndex((i) => i.product.id === product.id);
    if (idx >= 0) {
      items[idx].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.items$.next([...items]);
  }

  removeProduct(productId: string) {
    this.items$.next(this.items$.getValue().filter((i) => i.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }
    const items = this.items$.getValue();
    const idx = items.findIndex((i) => i.product.id === productId);
    if (idx >= 0) {
      items[idx].quantity = quantity;
      this.items$.next([...items]);
    }
  }

  clear() {
    this.items$.next([]);
  }

  toOrderItems(): OrderItem[] {
    return this.items$.getValue().map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));
  }
}
