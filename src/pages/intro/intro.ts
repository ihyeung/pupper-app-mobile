import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageUtilities } from '../../providers';
import { environment as ENV } from '../../environments/environment';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  introReady: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public util: StorageUtilities) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');


    this.util.getDataFromStorage('introComplete').then(val =>  {
      if (val) {
        console.log('Intro previously completed');

        if (ENV.CLEAR_STORAGE_ON_HOME) {
          this.util.clearStorage().then(() => { //Reset storage data
            this.util.storeData('introComplete', true); //Re-save introComplete
            this.navCtrl.push('HomePage');
          });
        } else {
          this.navCtrl.push('HomePage');
        }
      } else {
        this.introReady = true;
      }
    });
  }

  finishIntro() {
    console.log('Intro finished, adding to storage');
    this.util.storeData('introComplete', true);

    this.navCtrl.push('HomePage');
  }

}
