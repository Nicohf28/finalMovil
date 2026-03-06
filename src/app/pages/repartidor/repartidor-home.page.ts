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
  selector: 'app-repartidor-home',
  templateUrl: './repartidor-home.page.html',
  styleUrls: ['./repartidor-home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class RepartidorHomePage implements OnInit, OnDestroy {
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
    this.ordersSub = this.ordersService.getOrdersForRepartidor().subscribe((list) => {
      const uid = this.authService.getCurrentUser()?.uid;
      this.orders = list
        .filter((o) => o.status === 'pendiente' || (o.status !== 'entregado' && o.repartidorUid === uid))
        .sort((a, b) => {
          if (a.status === 'pendiente' && b.status !== 'pendiente') return -1;
          if (a.status !== 'pendiente' && b.status === 'pendiente') return 1;
          return b.createdAt - a.createdAt;
        });
    });
  }

  ngOnDestroy() {
    this.ordersSub?.unsubscribe();
    this.roleSub?.unsubscribe();
  }

  openOrder(order: Order) {
    this.router.navigate(['/repartidor/order', order.id]);
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
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
