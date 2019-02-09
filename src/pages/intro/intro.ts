import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageUtilities } from '../../providers';

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
        this.navCtrl.push('HomePage');
      } else {
        this.introReady = true;
      }
    });
  }

  finishIntro() {
    this.util.storeData('introComplete', true);

    this.navCtrl.push('HomePage');
  }

}
