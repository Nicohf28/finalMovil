export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pendiente'   // recién creado por el local
  | 'asignado'    // repartidor aceptó
  | 'en_camino'  // repartidor en ruta
  | 'entregado';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  localUid: string;
  localEmail: string;
  repartidorUid?: string;
  repartidorEmail?: string;
  deliveryAddress?: string;
  createdAt: number;
}
