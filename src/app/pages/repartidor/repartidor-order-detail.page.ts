import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { Order, OrderStatus } from '../../models/order';
import { OrderChatComponent } from '../../components/order-chat/order-chat.component';
import { TrackingMapComponent } from '../../components/tracking-map/tracking-map.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-repartidor-order-detail',
  templateUrl: './repartidor-order-detail.page.html',
  styleUrls: ['./repartidor-order-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, OrderChatComponent, TrackingMapComponent],
})
export class RepartidorOrderDetailPage implements OnInit, OnDestroy {
  order: Order | null = null;
  private orderSub?: Subscription;

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get showMap(): boolean {
    return !!(
      this.order &&
      (this.order.status === 'asignado' || this.order.status === 'en_camino')
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private ordersService: OrdersService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/repartidor']);
      return;
    }
    this.orderSub = this.ordersService.getOrderById(id).subscribe((o) => (this.order = o));
  }

  ngOnDestroy() {
    this.orderSub?.unsubscribe();
  }

  async setStatus(status: OrderStatus) {
    if (!this.order) return;
    const user = this.authService.getCurrentUser();
    if (!user && (status === 'asignado' || status === 'en_camino' || status === 'entregado')) return;

    const loading = await this.loadingCtrl.create({ message: 'Actualizando...' });
    await loading.present();

    try {
      await this.ordersService.updateOrderStatus(
        this.order.id,
        status,
        status === 'asignado' ? user!.uid : undefined,
        status === 'asignado' ? user!.email ?? undefined : undefined
      );
      await loading.dismiss();
      if (status === 'entregado') {
        const alert = await this.alertCtrl.create({
          header: 'Pedido entregado',
          message: 'El pedido se marcó como entregado.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/repartidor']) }],
        });
        await alert.present();
      }
    } catch (err: any) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: err?.message ?? 'No se pudo actualizar.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goBack() {
    this.router.navigate(['/repartidor']);
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
