import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ViewController } from 'ionic-angular';
import { Utilities, MatchProfiles, Users } from '../../providers';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile-snapshot',
  templateUrl: 'profile-snapshot.html',
})
export class ProfileSnapshotPage {

  // welcome: string;
  userObj: any = [];
  profileReady: boolean = false;

  constructor(public navCtrl: NavController,
    public utilService: Utilities, public matchProfService: MatchProfiles,
    public userService: Users) {
    }

    retrieveMatchProfilesForUser(){
      this.utilService.getUserFromStorage().then(user => {
        console.log("retrievd user from storage" + user);
        // this.welcome = `Welcome back, ${user['name']}!`;
        this.userObj = user;

        this.matchProfService.getMatchProfiles(user)
        .map(res => res.json())
        .subscribe(resp => {
          this.profileReady = true;
            //Check to see whether user has previously created match profiles
            if (resp['matchProfiles']) {
              let matchProfileObj = resp['matchProfiles'][0];
              console.log(matchProfileObj);
              this.utilService.storeMatchProfile(matchProfileObj);
            } else {
              this.utilService.presentDismissableToast("Please create a matching profile to get started.");
              this.navCtrl.push('CreateMatchProfilePage');
            }
        }, err => console.error('ERROR', err));
      });
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfileSnapshotPage');
      this.retrieveMatchProfilesForUser();
    }

    viewMatchProfileModal() {
      this.navCtrl.push('MatchProfileDetailPage');
    }

    createMatchProfile() {
      this.navCtrl.push('CreateMatchProfilePage');
    }

    updateMatchProfile() {
    }

    deleteMatchProfile() {
    }

    viewUserProfileModal() {
      this.navCtrl.push('UserProfileDetailPage');
    }

    updateUserProfile() {

    }

  }
