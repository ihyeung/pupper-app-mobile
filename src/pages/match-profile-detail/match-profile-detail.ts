import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities, MatchProfiles } from '../../providers';
import { DEFAULT_IMG } from '../';


@IonicPage()
@Component({
  selector: 'page-match-profile-detail',
  templateUrl: 'match-profile-detail.html',
})
export class MatchProfileDetailPage {

  id: number;
  profile: any;
  profileReady: boolean = false;
  readOnly: boolean = true;
  matchProfiles: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public matchProfileService: MatchProfiles) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchProfileDetailPage');
    // this.id = this.navParams.get('matchProfileId');
    this.readOnly = this.navParams.get('readOnly');
    this.matchProfiles = this.navParams.get('matchProfiles');
    const matchProfile = this.navParams.get('matchProfile');

    if (matchProfile) {
      this.setProfile(matchProfile);
    }
    if (this.matchProfiles) {
      console.log('User has ' + this.matchProfiles.length + ' match profiles');

      //TODO: Display modal pane with match profiles you can swipe through
    }
    // else if (this.id) {
      // this.retrieveProfileData(this.id);
    // }
    // else if (this.matchProfiles) {
    //   console.log('multiple matchProfiles retrieved from navparms ' + this.matchProfiles.length);
    // } else { //Otherwise retrieve active user's match profile stored in storage
    //   this.utils.getDataFromStorage('match').then(val => {
    //     if (!val) {
    //       this.navCtrl.push('CreateMatchProfilePage');
    //     } else {
    //       this.setProfile(val);
    //     }
    //   });
    // }
  }

  // retrieveProfileData(id: number) {
  //   console.log('retrieving match profile detail for ' + id);
  //   this.matchProfileService.getMatchProfileById(id)
  //   .map(res => res.json())
  //   .subscribe(response => {
  //       console.log('successfully retrieved match profile by id');
  //       console.log(response);
  //
  //       this.setProfile(response);
  //   }, err => console.error('ERROR', err));
  // }

  setProfile(profile: any) {
    this.profile = profile;
    this.profileReady = true;
  }

  editMatchProfile() {
    console.log("retrieving match profile for edit/update with id = " + this.id);
    console.log("Not implemented yet");

  }

  viewUserProfile() {
    const userId = this.profile['userProfile']['id'];
    console.log("retrieving user profile with id = " + userId);

    this.navCtrl.push('UserProfileDetailPage', {
      userId: userId,
      readOnly : true
    });
  }

}
