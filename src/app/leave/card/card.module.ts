import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardPageRoutingModule } from './card-routing.module';

import { CardPage } from './card.page';
import { UpdatePopoverComponent } from '../update-popover/update-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardPageRoutingModule
  ],
  entryComponents: [UpdatePopoverComponent ],
  declarations: [CardPage, UpdatePopoverComponent]
})
export class CardPageModule {}
