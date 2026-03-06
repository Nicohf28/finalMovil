import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-chat',
  templateUrl: './order-chat.component.html',
  styleUrls: ['./order-chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class OrderChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() orderId = '';
  @Input() currentUid = '';
  @Input() currentEmail = '';
  @Input() currentRole: 'local' | 'repartidor' = 'local';
  @ViewChild('messagesEnd') messagesEnd!: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];
  newText = '';
  sending = false;
  private sub?: Subscription;
  private scrollToBottom = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    if (!this.orderId) return;
    this.sub = this.chatService.getMessages(this.orderId).subscribe((list) => {
      this.messages = list;
      this.scrollToBottom = true;
    });
  }

  ngAfterViewChecked() {
    if (this.scrollToBottom && this.messagesEnd?.nativeElement) {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.scrollToBottom = false;
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async send() {
    const text = this.newText.trim();
    if (!text || this.sending || !this.orderId) return;
    this.sending = true;
    try {
      await this.chatService.sendMessage(
        this.orderId,
        this.currentUid,
        this.currentEmail,
        this.currentRole,
        text
      );
      this.newText = '';
    } finally {
      this.sending = false;
    }
  }

  formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  isOwn(msg: ChatMessage): boolean {
    return msg.fromUid === this.currentUid;
  }
}
