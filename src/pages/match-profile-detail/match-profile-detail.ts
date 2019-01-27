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
  matchProfiles: any = []; //Routed from view match profiles button from profile snapshot page, modal will show list of match profiles with active match profile at the top

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public matchProfileService: MatchProfiles) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchProfileDetailPage');
    this.id = this.navParams.get('matchProfileId');//Only sent from matching page
    this.readOnly = this.navParams.get('readOnly');//Determines whether or not to display edit button
    this.matchProfiles = this.navParams.get('matchProfiles');//Passed from profile snapshot page
    const matchProfile = this.navParams.get('matchProfile'); //Passed from inbox page, if passed from profile snapshot page, represents first (ie active/default) match profile to display in list

    if (this.id) {
      this.retrieveProfileData(this.id);
    }
    else if (matchProfile) {
      this.initProfileData(matchProfile);
    }
    if (this.matchProfiles) {
      console.log('User has ' + this.matchProfiles.length + ' match profiles');

      //TODO: Display modal pane with match profiles you can swipe through
      //TODO: if matchProfiles nav param is passed, then there should also be a
      // matchProfile param representing the active/default match profile, this should be displayed
      //at the top of the list of profiles
    }

  }

  retrieveProfileData(id: number) {
    console.log('retrieving match profile detail for ' + id);
    this.matchProfileService.getMatchProfileByMatchProfileId(id)
    .map(res => res.json())
    .subscribe(response => { //Directly maps to matchProfile object
        console.log('successfully retrieved match profile by id');
        this.initProfileData(response);
    }, err => console.error('ERROR: ', JSON.stringify(err)));
  }

  initProfileData(profile: any) {
    this.profile = profile;
    this.id = this.profile['id'];
    this.profile['profileImage'] =
          this.utils.validateImageUri(this.profile['profileImage'], DEFAULT_IMG);
    this.profileReady = true;
  }

  editMatchProfile(matchProfile: any) {
    console.log("retrieving match profile for edit/update with id = " + matchProfile['id']);
    console.log("Not implemented yet");

  }

  viewUserProfile(matchProfile: any) {
    console.log(matchProfile);
    const userId = matchProfile['userProfile']['id'];
    console.log("retrieving user profile with id = " + userId);
    this.navCtrl.push('UserProfileDetailPage', {
      userId: userId,
      readOnly : true
    });
  }

}
