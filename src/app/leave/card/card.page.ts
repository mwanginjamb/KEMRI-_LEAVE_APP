import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';
import { Leave } from 'src/app/models/leave.model';
import { LeaveService } from '../leave.service';
import { UpdatePopoverComponent } from '../update-popover/update-popover.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit, OnDestroy {

  id: string;
  cardSub: Subscription;
  Card: Leave;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leaveService: LeaveService,
    private popOverCtrl: PopoverController
    ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cardSub = this.leaveService.LeaveCard(this.id).subscribe(result => {
      this.Card = result;
    });  
  }
  
  ngOnDestroy()
  {
    if(this.cardSub) {
      return this.cardSub.unsubscribe();
    }
  }

  updatePopover(event,No: string) {
    return this.popOverCtrl.create({
      component: UpdatePopoverComponent,
      componentProps: { No },
      event
    }).then(pop => {
      pop.present();
    });
  }

  refresh(event) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cardSub = this.leaveService.LeaveCard(this.id).subscribe(result => {
      this.Card = result;
    });
    
    timer(2000).subscribe( () => {
      if(event) {
        event.target.complete();
      }
    });
    

  }

}
        