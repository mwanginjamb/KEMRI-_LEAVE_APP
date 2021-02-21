import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { User } from './user';

import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  authSub: Subscription;
  empSub: Subscription;
  failed = false;
  authenticated: boolean;
  user: User;
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {

  }

  async onSubmit(form: NgForm) {

    // Show the loading indicator
    await this.presentLoading();

    if (!form.valid){
      return;
    }
    const username = form.value.username;
    const password = form.value.password;

    this.authSub = this.auth.authenticate(username, password)
    .pipe(
      finalize(async () => {
        await this.loading.dismiss();
      })
    )
    .subscribe( async (result) => {
        if (typeof result === 'object') {
          // redirect to dashboard and store user data in local storage
          this.auth.login(result);  // Saves User Session
          this.user = result;
          this.Employee();
          await this.auth.authenticated(true);
          return this.router.navigate(['./leave']);
        }else{
          
          this.alertCtrl.create(
            {
              header: 'Operation Error',
              message: 'Message: '+ result,
              buttons: [{ text: 'Okay', handler: () => this.alertCtrl.dismiss() }]
            }
          ).then(alertEl => {
            alertEl.present();
          });

          this.failed = true;
        }
    }, error => {
      this.alertCtrl.create(
        {
          header: 'Service Error',
          message: 'Message: '+ error.error.message,
          buttons: [{ text: 'Okay', handler: () => this.alertCtrl.dismiss() }]
        }
      ).then(alertEl => {
        alertEl.present();
      });
      this.failed = true;

    });
  }

   Employee() {
    // console.log(this.user.Employee_No);
    this.empSub = this.auth.fetchEmployee(this.user.Employee_No).subscribe( async (res) => {
       await this.auth.setEmployee(res);
    }, error => {
      console.log(error.error);
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      animated: true,
      message: 'Authenticating',
    });

    // present the controller
    await this.loading.present();
  }

}
