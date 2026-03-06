import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { USER_ROLE_LABELS, UserRole } from '../../models/user-role';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-local-home',
  templateUrl: './local-home.page.html',
  styleUrls: ['./local-home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class LocalHomePage implements OnInit, OnDestroy {
  products: Product[] = [];
  role: UserRole | null = null;
  roleLabel = '';
  cartCount = 0;
  private roleSub?: Subscription;
  private cartSub?: Subscription;

  constructor(
    private authService: AuthService,
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.products = this.productsService.getProducts();
    this.roleSub = this.authService.role$.subscribe((r) => {
      this.role = r;
      this.roleLabel = r ? USER_ROLE_LABELS[r] : '';
    });
    this.cartSub = this.cartService.getItems().subscribe(() => {
      this.cartCount = this.cartService.getItemCount();
    });
    this.cartCount = this.cartService.getItemCount();
  }

  ngOnDestroy() {
    this.roleSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  addToCart(product: Product) {
    this.cartService.addProduct(product, 1);
  }

  goToCart() {
    this.router.navigate(['/local/cart']);
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n);
  }
}
