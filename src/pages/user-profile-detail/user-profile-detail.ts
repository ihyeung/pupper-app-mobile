import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-user-profile-detail',
  templateUrl: 'user-profile-detail.html',
})
export class UserProfileDetailPage {

  profile: any;
  profileReady: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public utils: Utilities) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfileDetailPage');
    this.utils.getUserFromStorage().then(val => {
      if (!val) {
        console.log('no object found in storage for user');
      } else {
      this.profile = val;
      this.profileReady = true;
    }
  });
  }

}
