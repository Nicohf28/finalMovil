import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { USER_ROLE_LABELS, UserRole } from '../../models/user-role';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class CartPage implements OnInit, OnDestroy {
  items: CartItem[] = [];
  total = 0;
  role: UserRole | null = null;
  roleLabel = '';
  deliveryAddress = '';
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.sub = this.cartService.getItems().subscribe((items) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
    this.role = this.authService.getCurrentRole();
    this.roleLabel = this.role ? USER_ROLE_LABELS[this.role] : '';
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  updateQty(productId: string, delta: number) {
    const item = this.items.find((i) => i.product.id === productId);
    if (!item) return;
    this.cartService.updateQuantity(productId, item.quantity + delta);
  }

  remove(productId: string) {
    this.cartService.removeProduct(productId);
  }

  async confirmOrder() {
    if (this.items.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Carrito vacío',
        message: 'Añade productos antes de confirmar.',
        buttons: ['OK'],
      });
      await alert.present();
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

    this.router.navigate(['/local/checkout'], {
      state: { deliveryAddress: this.deliveryAddress || '' },
    });
  }

  goBack() {
    this.router.navigate(['/local']);
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n);
  }
}
