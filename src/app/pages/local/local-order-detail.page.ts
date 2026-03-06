import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { Order, OrderStatus } from '../../models/order';
import { OrderChatComponent } from '../../components/order-chat/order-chat.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-local-order-detail',
  templateUrl: './local-order-detail.page.html',
  styleUrls: ['./local-order-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, OrderChatComponent],
})
export class LocalOrderDetailPage implements OnInit, OnDestroy {
  order: Order | null = null;
  private orderSub?: Subscription;

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/local/orders']);
      return;
    }
    this.orderSub = this.ordersService.getOrderById(id).subscribe((o) => (this.order = o));
  }

  ngOnDestroy() {
    this.orderSub?.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/local/orders']);
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n);
  }

  formatDate(ts: number): string {
    return new Date(ts).toLocaleString('es-CO');
  }

  statusLabel(s: OrderStatus): string {
    const l: Record<OrderStatus, string> = {
      pendiente: 'Pendiente',
      asignado: 'Asignado',
      en_camino: 'En camino',
      entregado: 'Entregado',
    };
    return l[s];
  }
}
