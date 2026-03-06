export interface ChatMessage {
  id: string;
  orderId: string;
  fromUid: string;
  fromEmail: string;
  fromRole: 'local' | 'repartidor';
  text: string;
  createdAt: number;
}
