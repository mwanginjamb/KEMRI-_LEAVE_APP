import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Leave } from 'src/app/models/leave.model';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  Leave: Leave = new Leave();
  id: string;
  leaveSub: Subscription;
  loading: HTMLIonLoadingElement;
  leaveTypesSub: Subscription;
  employeeSub: Subscription;
  employees: any;
  leaveTypes: any;
  approvalSub: Subscription;
  toastCtrl: ToastController


  constructor(
    private activatedRoute: ActivatedRoute,
    private leaveService: LeaveService,
    private popOverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,

  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(`Leave Id is : ${this.id}`);

    this.dismissPopover();
    this.fetchLeaveTypes();
    this.fetchEmployees();
    // Get the damn leave to update
    this.fetchLeave(this.id);
  }


  async dismissPopover() {
    await this.popOverCtrl.dismiss();
  }

  fetchLeave(No: string) {
    this.presentLoading();
    this.leaveSub = this.leaveService.LeaveCard(No)
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
            header: 'Service Error!',
            message: result,
            buttons: [{ text: 'Okay'}]
          })
          .then(alertEl => {
            alertEl.present();
          });
          return; 
      }
      this.Leave = result;
      
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      animated: true,
      message: 'Loading..',
    });

    // present the controller
    await this.loading.present();
  }

  fetchLeaveTypes() {
    this.leaveTypesSub = this.leaveService.LeaveTypes.subscribe( result => {
     
      this.leaveTypes = result;
      
    });
  }

  fetchEmployees() {
    this.employeeSub = this.leaveService.Employees.subscribe(res => {
  
      this.employees = res;
      
    });
  }

  apply() {
    this.approvalSub = this.leaveService.apply(this.Leave.Application_No).subscribe( result => {
      console.log(`Leave Approval Result: ${result}`);
      if(typeof result === 'object') {
        this.toastCtrl.create({
          message: 'Leave Submitted to Line Manager for Approval.',
          duration: 3000,
          position: 'top'
        }).then( toastEl => toastEl.present());

        // redirect to list

        timer(3100).subscribe(() => {
          this.router.navigate(['./','list']);
        })

      }else {
        this.alertCtrl.create({
          header: 'Operation Error',
          message: 'Message: '+ result,
          buttons: [{ text: 'Okay', handler: () => this.alertCtrl.dismiss() }]
        }).then(alertEl => {
          alertEl.present();
        }); 
      }
    });
  }

  updateLeave() {
    this.Leave.Start_Date = this.leaveService.formatDate(this.Leave.Start_Date);
    this.leaveSub = this.leaveService.postLeave(this.Leave).subscribe( result => {
      console.log('POSTED LEAVE');
      console.log(typeof result);

      if(typeof result == 'object'){
        this.Leave = result;
      }else if( typeof result == 'string') {
        this.alertCtrl.create({
          header: 'Operation Error',
          message: 'Message: '+ result,
          buttons: [{ text: 'Okay', handler: () => this.alertCtrl.dismiss() }]
        }).then(alertEl => {
          alertEl.present();
        });
      }

    });
  }


}
