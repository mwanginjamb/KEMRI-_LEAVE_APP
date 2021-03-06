import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription, timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Leave } from 'src/app/models/leave.model';
import { environment } from 'src/environments/environment';
import { LeavePopoverComponent } from '../leave-popover/leave-popover.component';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
  EmployeeNo: string;
  leaveSub: Subscription;
  leaves: Leave[];
  searchTerm: string = '';
  user: any;
  loading: HTMLIonLoadingElement;
 
  constructor(
    private leaveSearvice: LeaveService,
    private popOverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    public navCtrl: NavController,
    private authService: AuthService,
    private storage: Storage,
    ) {

   }

  async ngOnInit() {
    await this.fetchEmployeeNo();
    // Get a list of leaves
    if(this.EmployeeNo) {
      this.fetchLeaveList(this.EmployeeNo);
    }
    
    
  }

  async fetchEmployeeNo() {
    const Employee = await this.authService.getEmployee()
    this.EmployeeNo =  Employee?.No;
    console.log('Logged in Employee........');
    console.log(Employee.No);
  }

 

  details(id: string){
    console.log('navigaring...');
    return this.router.navigate(['./leave/'+id]);
    
  }

  fetchLeaveList(Empno: string) {
    this.presentLoading();
    this.leaveSub = this.leaveSearvice.Leaves(Empno)
    .pipe(
      finalize(async () => {
        await this.loading.dismiss();
      })
    )
    .subscribe( result => {
      console.log(result);
      if(typeof result == 'string' || typeof result !== 'object') {
        this.loading.dismiss();
          this.alertCtrl.create({
            header: 'Connection Error!',
            message: result,
            buttons: [{ text: 'Okay'}]
          })
          .then(alertEl => {
            alertEl.present();
          });
          return; 
      }
      this.leaves = this.sort([...result]);
      
    }, error => {
      this.loading.dismiss();
      this.alertCtrl.create({
        header: 'Service Error!',
        message: error.error.message,
        buttons: [{ text: 'Okay'}]
      })
      .then(alertEl => {
        alertEl.present();
      });
    });
  }

  sort(dataArray: Leave[]){
    return dataArray.sort((a,b) => (b.Application_No > a.Application_No) ? 1: -1);
  }

  presentPopover(event) {
    return this.popOverCtrl.create({
      component: LeavePopoverComponent,
      event
    }).then(pop => {
      pop.present();
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      animated: true,
      message: 'Loading..',
    });

    // present the controller
    await this.loading.present();
  }

  search($event) {
     // get a copy of requisitions
     const searchItems = [... this.leaves];

     // Begin search, only if searchTerm is provided
     if (this.searchTerm.trim().length && this.searchTerm !== '') {
       this.leaves = searchItems.filter((req) => {
         if ( req.Application_No && req.Application_No.length > 1 ){
           return ( req.Application_No.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 );
         }
      });
       return;
     }else{ // Search Term not provided display all requisitions
       this.initializeItems();
     }
  }

  refresh(event) {
    this.fetchLeaveList(this.EmployeeNo);

    timer(900).subscribe( () => {
      if(event) {
        event.target.complete();
      }
    });
   
  }

  initializeItems() {
   this.fetchLeaveList(this.EmployeeNo);
  }


  ngOnDestroy() {
    if(this.leaveSub) {
      this.leaveSub.unsubscribe();
    }
  }

  

}
