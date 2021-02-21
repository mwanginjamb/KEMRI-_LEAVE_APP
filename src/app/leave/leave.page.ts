import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Leave } from '../models/leave.model';
import { LeaveService } from './leave.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.page.html',
  styleUrls: ['./leave.page.scss'],
})
export class LeavePage implements OnInit, OnDestroy {
  EmployeeNo: string;
  Gender: string;
  leave: Leave = new Leave();
  employeeSub: Subscription;
  leaveTypesSub: Subscription;
  leaveSub: Subscription;
  approvalSub: Subscription;
  employees: any;
  leaveTypes: any;

  constructor(
    private popOverCtrl: PopoverController,
    private leaveService: LeaveService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService,
    ) { }

 async ngOnInit() {
   await this.fetchEmployeeNo();
   await this.fetchEmployeeGender();
    this.dismissPopover();
    this.fetchEmployees();
    this.fetchLeaveTypes(this.Gender);
    if(this.EmployeeNo){
      this.leaveInit();
    }
   
    
  

    // console.log(this.employees);
    // console.log(this.leaveTypes);
  }

  async dismissPopover() {
    await this.popOverCtrl.dismiss();
  }

  fetchEmployees() {
    this.employeeSub = this.leaveService.Employees.subscribe(res => {
  
      this.employees = res;
      
    });
  }

  async fetchEmployeeNo() {
    const Employee = await this.authService.getEmployee()
    this.EmployeeNo =  Employee?.No;
    console.log('Logged in Employee On Card........');
    console.log(this.EmployeeNo);
  }

  async fetchEmployeeGender() {
    const Employee = await this.authService.getEmployee()
    this.Gender =  Employee?.Gender;
    console.log('Employee Gender........');
    console.log(Employee.Gender);
  }

  fetchLeaveTypes(Gender: string) {
    this.leaveTypesSub = this.leaveService.LeaveTypes(Gender).subscribe( result => {
     
      this.leaveTypes = result;
      
    });
  }

  apply() {
    this.approvalSub = this.leaveService.apply(this.leave.Application_No).subscribe( result => {
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

  leaveInit() {

    this.leaveSub = this.leaveService.Leave(this.EmployeeNo).subscribe(result => {

      //console.log('Leave Init Things.....');
      //console.table(result);
      //console.log(typeof result);
      if(typeof result === 'object'){
        this.leave = result;
      }else {
        this.alertCtrl.create({
          header: 'Operation Error',
          message: 'Message: '+ result,
          buttons: [{ text: 'Okay', handler: () => this.modalCtrl.dismiss() }]
        }).then(alertEl => {
          alertEl.present();
        });
      }
    });
  }

  updateLeave() {
    this.leave.Start_Date = this.leaveService.formatDate(this.leave.Start_Date);
    this.leaveSub = this.leaveService.postLeave(this.leave).subscribe( result => {
      console.log('POSTED LEAVE');
      console.log(typeof result);

      if(typeof result == 'object'){
        this.leave = result;
      }else if( typeof result == 'string') {
        this.alertCtrl.create({
          header: 'Operation Error',
          message: 'Message: '+ result,
          buttons: [{ text: 'Okay', handler: () => this.modalCtrl.dismiss() }]
        }).then(alertEl => {
          alertEl.present();
        });
      }

    });
  }


  

  ngOnDestroy() {
    if(this.employeeSub) {
      this.employeeSub.unsubscribe();
    }

    if(this.leaveTypesSub) {
      this.leaveTypesSub.unsubscribe();
    }
  }

}
