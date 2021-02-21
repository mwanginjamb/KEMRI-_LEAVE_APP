import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public navCtrl: NavController, private iab: InAppBrowser) {}


  ngOnInit(){
    // const browser = this.iab.create('http://172.18.12.209:2026','_self',{location: 'no'});
       
  }
}


