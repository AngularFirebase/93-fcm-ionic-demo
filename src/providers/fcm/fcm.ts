import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore'

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform
  ) {}

  async getToken() {

    let token;

    if (this.platform.is('cordova')) {
      token = await this.firebaseNative.getToken();
    } else {
      // Get token via AngularFire2 or web SDK
      token = null
    }
    return this.saveTokenToFirestore(token)
  }

  private saveTokenToFirestore(token) {
    const devicesRef = this.afs.collection('devices')

    const doc = { 
      token,
      userId: 'testUser',
    }

    return devicesRef.add(doc)
  }

}
