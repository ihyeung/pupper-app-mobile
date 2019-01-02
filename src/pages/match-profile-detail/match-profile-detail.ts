import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities, MatchProfiles } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-match-profile-detail',
  templateUrl: 'match-profile-detail.html',
})
export class MatchProfileDetailPage {
  id: number;
  profile: any;
  profileReady: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public matchProfileService: MatchProfiles) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchProfileDetailPage');
    this.id = this.navParams.get('matchProfileId');
    if (this.id) {
      this.retrieveProfileData(this.id);
    } else {
      this.utils.getDataFromStorage('match').then(val => {
        if (!val) {
          this.navCtrl.push('CreateMatchProfilePage');
        } else {
          this.profile = val;
          this.profileReady = true;
        }
      })
    }
  }

  retrieveProfileData(id: number) {
    this.matchProfileService.getMatchProfileById(id)
    .map(res => res.json())
    .subscribe(response => {
      if (response['matchProfiles']) {
        this.profile = response['matchProfiles'][0];
        this.profileReady = true;
      }
    }, err => console.error('ERROR', err));
  }

}
