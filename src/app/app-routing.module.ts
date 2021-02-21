import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'details/:id',
    loadChildren: () => import('./leave/card/card.module').then(m => m.CardPageModule)
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'leave',
    children: [
      {
        path: '',
        loadChildren: () => import('./leave/leave.module').then(m => m.LeavePageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./leave/card/card.module').then(m => m.CardPageModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./leave/list/list.module').then(m => m.ListPageModule)
      },
      {
        path: 'apply',
        loadChildren: () => import('./leave/leave.module').then(m => m.LeavePageModule)
      },
      {
        path: 'update/:id',
        loadChildren: () => import('./leave/update/update.module').then( m => m.UpdatePageModule)
      }
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
