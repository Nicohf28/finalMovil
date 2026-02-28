import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'create', loadComponent: () => import('./create/create.page').then(m => m.CreatePage) },
  { path: 'detail/:id', loadComponent: () => import('./detail/detail.page').then(m => m.DetailPage) },
  { path: 'edit/:id', loadComponent: () => import('./edit/edit.page').then(m => m.EditPage) },
  { path: '', redirectTo: 'create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}