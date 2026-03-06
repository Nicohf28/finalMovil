import { Injectable } from '@angular/core';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';
import { Observable } from 'rxjs';
import { Order, OrderItem, OrderStatus } from '../models/order';
import { v4 as uuidv4 } from 'uuid';

const db = getDatabase();
const ORDERS_PATH = 'orders';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  createOrder(
    items: OrderItem[],
    total: number,
    localUid: string,
    localEmail: string,
    deliveryAddress?: string
  ): Promise<string> {
    const id = uuidv4();
    const order: Order = {
      id,
      items,
      total,
      status: 'pendiente',
      localUid,
      localEmail,
      deliveryAddress: deliveryAddress || '',
      createdAt: Date.now(),
    };
    return set(ref(db, `${ORDERS_PATH}/${id}`), order).then(() => id);
  }

  getOrdersForLocal(localUid: string): Observable<Order[]> {
    return new Observable((subscriber) => {
      const ordersRef = ref(db, ORDERS_PATH);
      const unsub = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val() || {};
        const list: Order[] = Object.entries(data)
          .map(([key, val]: [string, any]) => ({ id: key, ...val }))
          .filter((o: Order) => o.localUid === localUid)
          .sort((a: Order, b: Order) => b.createdAt - a.createdAt);
        subscriber.next(list);
      });
      return () => unsub();
    });
  }

  getOrdersForRepartidor(): Observable<Order[]> {
    return new Observable((subscriber) => {
      const ordersRef = ref(db, ORDERS_PATH);
      const unsub = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val() || {};
        const list: Order[] = Object.entries(data).map(([key, val]: [string, any]) => ({
          id: key,
          ...val,
        }));
        subscriber.next(list);
      });
      return () => unsub();
    });
  }

  getOrderById(orderId: string): Observable<Order | null> {
    return new Observable((subscriber) => {
      const orderRef = ref(db, `${ORDERS_PATH}/${orderId}`);
      const unsub = onValue(orderRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          subscriber.next(null);
          return;
        }
        subscriber.next({ id: orderId, ...data });
      });
      return () => unsub();
    });
  }

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    repartidorUid?: string,
    repartidorEmail?: string
  ): Promise<void> {
    const updates: Record<string, unknown> = { status };
    if (repartidorUid) updates['repartidorUid'] = repartidorUid;
    if (repartidorEmail) updates['repartidorEmail'] = repartidorEmail;
    return update(ref(db, `${ORDERS_PATH}/${orderId}`), updates);
  }
}
