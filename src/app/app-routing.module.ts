import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'local',
    loadComponent: () =>
      import('./pages/local/local-home.page').then(m => m.LocalHomePage),
    canActivate: [roleGuard(['local'])]
  },
  {
    path: 'local/cart',
    loadComponent: () =>
      import('./pages/local/cart.page').then(m => m.CartPage),
    canActivate: [roleGuard(['local'])]
  },
  {
    path: 'local/checkout',
    loadComponent: () =>
      import('./pages/local/checkout.page').then(m => m.CheckoutPage),
    canActivate: [roleGuard(['local'])]
  },
  {
    path: 'local/orders',
    loadComponent: () =>
      import('./pages/local/local-orders.page').then(m => m.LocalOrdersPage),
    canActivate: [roleGuard(['local'])]
  },
  {
    path: 'local/order/:id',
    loadComponent: () =>
      import('./pages/local/local-order-detail.page').then(m => m.LocalOrderDetailPage),
    canActivate: [roleGuard(['local'])]
  },
  {
    path: 'repartidor',
    loadComponent: () =>
      import('./pages/repartidor/repartidor-home.page').then(m => m.RepartidorHomePage),
    canActivate: [roleGuard(['repartidor'])]
  },
  {
    path: 'repartidor/order/:id',
    loadComponent: () =>
      import('./pages/repartidor/repartidor-order-detail.page').then(m => m.RepartidorOrderDetailPage),
    canActivate: [roleGuard(['repartidor'])]
  },
  { path: 'create', redirectTo: 'local', pathMatch: 'full' },
  { path: 'detail/:id', redirectTo: 'local', pathMatch: 'full' },
  { path: 'edit/:id', redirectTo: 'local', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}