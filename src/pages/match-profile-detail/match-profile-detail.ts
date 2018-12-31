import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-match-profile-detail',
  templateUrl: 'match-profile-detail.html',
})
export class MatchProfileDetailPage {

  profile: any;
  profileReady: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities) {
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchProfileDetailPage');
    this.utils.getUserFromStorage().then(val => {
      if (val) {
        this.profile = val;
        this.profileReady = true;
      }
    });
  }

}
