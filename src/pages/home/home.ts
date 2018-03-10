import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FcmProvider } from '../../providers/fcm/fcm'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public fcm: FcmProvider) {}

  ionViewDidLoad(){
    this.fcm.getToken()
  }
  
  

}
