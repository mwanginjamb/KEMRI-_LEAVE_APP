import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardPage } from './card/card.page';

import { LeavePage } from './leave.page';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('../leave/list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'apply',
    component: LeavePage
  },
  {
    path: ':id',
    component: CardPage
  },
  {
    path: 'card',
    loadChildren: () => import('./card/card.module').then( m => m.CardPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./update/update.module').then( m => m.UpdatePageModule)
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeavePageRoutingModule {}
