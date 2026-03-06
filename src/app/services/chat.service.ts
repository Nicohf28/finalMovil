import { Injectable } from '@angular/core';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/message';

const db = getDatabase();
const CHATS_PATH = 'chats';

@Injectable({ providedIn: 'root' })
export class ChatService {
  sendMessage(
    orderId: string,
    fromUid: string,
    fromEmail: string,
    fromRole: 'local' | 'repartidor',
    text: string
  ): Promise<void> {
    const messagesRef = ref(db, `${CHATS_PATH}/${orderId}/messages`);
    return push(messagesRef, {
      orderId,
      fromUid,
      fromEmail,
      fromRole,
      text: text.trim(),
      createdAt: Date.now(),
    }).then(() => {});
  }

  getMessages(orderId: string): Observable<ChatMessage[]> {
    return new Observable((subscriber) => {
      const messagesRef = ref(db, `${CHATS_PATH}/${orderId}/messages`);
      const unsub = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val() || {};
        const list: ChatMessage[] = Object.entries(data)
          .map(([key, val]: [string, any]) => ({ id: key, ...val }))
          .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        subscriber.next(list);
      });
      return () => unsub();
    });
  }
}
