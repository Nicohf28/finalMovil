import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { PaypalService } from '../../services/paypal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class CheckoutPage implements OnInit {
  total = 0;
  canContinue = false;
  paypalReady = false;
  paypalError = '';
  private deliveryAddress = '';
  private creatingOrder = false;

  constructor(
    private router: Router,
    private zone: NgZone,
    private authService: AuthService,
    private cartService: CartService,
    private ordersService: OrdersService,
    private paypalService: PaypalService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.total = this.cartService.getTotal();
    this.deliveryAddress = (history.state?.['deliveryAddress'] as string) ?? '';
    this.canContinue = this.cartService.getItemCount() > 0 && this.total > 0;

    if (!this.canContinue) {
      this.router.navigate(['/local/cart']);
      return;
    }

    await this.initPaypalButtons();
  }

  private async initPaypalButtons() {
    try {
      await this.paypalService.loadSdk(environment.paypal.clientId, environment.paypal.currency);

      if (!window.paypal) {
        throw new Error('PayPal SDK no disponible.');
      }

      await window.paypal
        .Buttons({
          createOrder: (_data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.total.toFixed(2),
                    currency_code: environment.paypal.currency,
                  },
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
              },
            });
          },
          onApprove: async (_data, actions) => {
            await actions.order.capture();
            await this.zone.run(async () => {
              await this.finalizeOrder('paypal_sandbox');
            });
          },
          onError: (err) => {
            this.zone.run(() => {
              this.paypalError = `PayPal no pudo iniciar el pago: ${String(err)}`;
              this.paypalReady = false;
            });
          },
          onCancel: () => {
            this.zone.run(async () => {
              const alert = await this.alertCtrl.create({
                header: 'Pago cancelado',
                message: 'Puedes intentar de nuevo o continuar sin pagar.',
                buttons: ['OK'],
              });
              await alert.present();
            });
          },
        })
        .render('#paypal-button-container');

      this.paypalReady = true;
    } catch (error: any) {
      this.paypalError = error?.message ?? 'No se pudo cargar PayPal.';
      this.paypalReady = false;
    }
  }

  async continueWithoutPayment() {
    await this.finalizeOrder('sin_pago');
  }

  private async finalizeOrder(source: 'paypal_sandbox' | 'sin_pago') {
    if (this.creatingOrder) {
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user?.email) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo identificar tu cuenta.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.creatingOrder = true;
    const loading = await this.loadingCtrl.create({ message: 'Creando pedido...' });
    await loading.present();

    try {
      const orderItems = this.cartService.toOrderItems();
      const total = this.cartService.getTotal();

      await this.ordersService.createOrder(
        orderItems,
        total,
        user.uid,
        user.email,
        this.deliveryAddress || undefined
      );

      this.cartService.clear();
      await loading.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Pedido realizado',
        message:
          source === 'paypal_sandbox'
            ? 'Pago Sandbox aprobado y pedido creado.'
            : 'Pedido creado sin pago. Puedes integrar cobro real más adelante.',
        buttons: [
          {
            text: 'OK',
            handler: () => this.router.navigate(['/local']),
          },
        ],
      });
      await alert.present();
    } catch (err: any) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: err?.message ?? 'No se pudo crear el pedido.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      this.creatingOrder = false;
    }
  }

  goBack() {
    this.router.navigate(['/local/cart']);
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n);
  }
}
