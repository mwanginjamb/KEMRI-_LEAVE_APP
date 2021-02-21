import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { LeavePopoverComponent } from '../leave-popover/leave-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule
  ],
  entryComponents: [ LeavePopoverComponent],
  declarations: [ListPage, LeavePopoverComponent]
})
export class ListPageModule {}
