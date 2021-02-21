import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

username = "";


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fetchEmployee();
    });
  }

  exit() {
    console.log('You just logged me out!!');
    // Exit the App
    if (window.confirm(`Do you want to exit the app?`)) {
      navigator['app'].exitApp();
    }
  }

  async fetchEmployee() {
    const employee = await this.auth.getEmployee();
    if (typeof employee === 'object' && (employee.First_Name || employee.Last_Name)) {
        this.username = `${employee?.First_Name} ${employee?.Last_Name}`;
    }
    //console.log('Names.........');
    //console.log(this.username);
  }



}
