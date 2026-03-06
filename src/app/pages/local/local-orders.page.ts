import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';
import { USER_ROLE_LABELS, UserRole } from '../../models/user-role';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-local-orders',
  templateUrl: './local-orders.page.html',
  styleUrls: ['./local-orders.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class LocalOrdersPage implements OnInit, OnDestroy {
  orders: Order[] = [];
  role: UserRole | null = null;
  roleLabel = '';
  private ordersSub?: Subscription;
  private roleSub?: Subscription;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.roleSub = this.authService.role$.subscribe((r) => {
      this.role = r;
      this.roleLabel = r ? USER_ROLE_LABELS[r] : '';
    });
    const uid = this.authService.getCurrentUser()?.uid;
    if (uid) {
      this.ordersSub = this.ordersService.getOrdersForLocal(uid).subscribe((list) => (this.orders = list));
    }
  }

  ngOnDestroy() {
    this.ordersSub?.unsubscribe();
    this.roleSub?.unsubscribe();
  }

  openOrder(order: Order) {
    this.router.navigate(['/local/order', order.id]);
  }

  goBack() {
    this.router.navigate(['/local']);
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n);
  }

  formatDate(ts: number): string {
    return new Date(ts).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      asignado: 'Asignado',
      en_camino: 'En camino',
      entregado: 'Entregado',
    };
    return labels[status] ?? status;
  }

  itemCount(order: Order): number {
    return order.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;
  }
}
