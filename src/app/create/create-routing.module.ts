import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./create.page').then(m => m.CreatePage)
  }
];

export default routes;