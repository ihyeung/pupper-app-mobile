import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Utilities, MatchProfiles, Users } from '../../providers';
import { DEFAULT_IMG } from '../';
import { Dialogs } from '@ionic-native/dialogs';

@IonicPage()
@Component({
  selector: 'page-profile-snapshot',
  templateUrl: 'profile-snapshot.html',
})
export class ProfileSnapshotPage {

  welcome: string;
  image: string;
  userProfileObj: any = [];
  userReady: boolean = false;
  matchProfileReady: boolean = false;
  matchProfilesList: any = [];
  activeMatchProfileObj: any = [];
  hasMatchProfile: boolean = false;
  numMatchProfiles: number = 1;

  constructor(public navCtrl: NavController, public utilService: Utilities,
    public matchProfService: MatchProfiles, public dialogs: Dialogs,
    public users: Users) {
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfileSnapshotPage');
      this.retrieveMatchProfilesForUser();
    }

    retrieveMatchProfilesForUser(){
      this.utilService.getUserFromStorage().then(user => {
        console.log("retrievd user from storage" + user);
        this.welcome = `Welcome back, ${user['firstName']}!`;
        this.userProfileObj = user;
        this.image = user['profileImage'];
        this.userReady = true;

        this.matchProfService.getMatchProfiles(user)
        .map(res => res.json())
        .subscribe(resp => {
          // console.log(resp);
          console.log('Number fo match profiles for this user: ' + resp['matchProfiles'].length);
          if (resp['matchProfiles'] === undefined || resp['matchProfiles'].length == 0) {
            console.log("No match profiles for user");
            this.numMatchProfiles = 0;
            return;
          }
          this.numMatchProfiles = resp['matchProfiles'].length;
          this.matchProfilesList = resp['matchProfiles'];

          //Uncomment the code below after activeMatchProfile field has been added on backend
          this.activeMatchProfileObj = resp['matchProfiles'][0];

          // this.matchProfilesList.forEach(profile => {
          //   if (profile['id'] == this.userProfileObj['activeMatchProfile']) {
          //     this.activeMatchProfileObj = profile;
          //   }
          // });

          console.log(this.activeMatchProfileObj);
          this.utilService.storeMatchProfile(this.activeMatchProfileObj);
          this.hasMatchProfile = true;
          this.matchProfileReady = true;
        }, err => console.error('ERROR', err));
      });
    }

    matchProfileModal(readOnly: boolean) {
      if (this.hasMatchProfile) {
        this.navCtrl.push('MatchProfileDetailPage', {
          readOnly : readOnly,
          matchProfiles: this.matchProfilesList,
          matchProfile: this.activeMatchProfileObj
        });
      } else {
        this.utilService.presentDismissableToast("Please create a matching profile to get started.");
        this.navCtrl.push('CreateMatchProfilePage');
      }
    }

    createMatchProfile() {
      this.navCtrl.push('CreateMatchProfilePage');
    }

    deleteMatchProfile() {
      const message = `Are you sure you want to delete ${this.activeMatchProfileObj['names']}'s match profile ? This action cannot be undone.`;
      const title = `Delete ${this.activeMatchProfileObj['names']}'s matching profile?`;
      this.dialogs.prompt(message, title, ['Confirm', 'Cancel'],
      'Enter the name associated with this matching profile to confirm.')
      .then(obj => {
        if (obj.buttonIndex != 1) { //Cancel button pressed or user clicked outside dialog box
          return;
        }
        if (obj.input1 === undefined || obj.input1 != this.activeMatchProfileObj['names']) {
          console.log('does not match');
        } else {
          console.log('deleting matching profile ', this.activeMatchProfileObj['names']);

          //TODO: DELETE MATCH_RESULT AND PUPPER_MESSAGES LINKED TO THIS MATCH PROFILE FIRST
          this.deleteMatchProfileData();

          this.matchProfService.deleteMatchProfileById(this.userProfileObj['id'],
          this.activeMatchProfileObj['id'])
          .subscribe(resp => {

            console.log(resp);
            this.utilService.presentDismissableToast(`${this.activeMatchProfileObj['names']}'s matching profile successfully deleted.`);

            if (this.numMatchProfiles == 1) {
              this.utilService.storeData('match', null);
              this.activeMatchProfileObj = null;
              this.hasMatchProfile = false;
            } else {
              this.matchProfilesList = this.matchProfilesList.slice(1,);
              this.activeMatchProfileObj = this.matchProfilesList[0];
              this.utilService.storeData('match', this.activeMatchProfileObj);
              this.numMatchProfiles--;
            }

          }, err => console.error('ERROR', err));
        }
      })
      .catch(e => console.log('Error displaying dialog', e));
    }

    userProfileModal(readOnly: boolean) {
      this.navCtrl.push('UserProfileDetailPage', {
        readOnly : readOnly
      });
    }

    deleteMatchProfileData() {
      //1. delete match_result records
      //2. delete pupper_message records
    }

    updateZipCode() {
      const zipRegEx = /^\d{5}$/;
      this.dialogs.prompt('Update your user profile location/zip code to find local matches.', 'UDPATE USER ZIPCODE?', ['UPDATE', 'CANCEL'],
      'A valid 5-digit US zip code')
      .then(obj => {
        if (obj.buttonIndex != 1) { //Cancel button pressed or user clicked outside dialog box
          return;
        }
        if (obj.input1 === undefined || !zipRegEx.test(obj.input1)) {
          console.log('Invalid zipcode');
          return;
        }

        console.log('updating zip code from {} to {}', this.userProfileObj['zip'], obj.input1);
        let updatedUserObj = this.userProfileObj;
        updatedUserObj['zip'] = obj.input1;
        this.users.updateUserProfile(updatedUserObj)
        .map(res => res.json())
        .subscribe(resp => {
          if(resp['isSuccess']) {
            console.log('zip code successfully updated');
            this.userProfileObj = updatedUserObj;
            this.utilService.storeData('user', this.userProfileObj);
            this.utilService.presentDismissableToast(`Profile zip code location updated to '${obj.input1}'`);
          } else {
            console.log(resp);

          }
        }, err => console.error('ERROR UPDATING USER ZIP CODE', err));
      }).catch(e => console.log('Error displaying dialog', e));
    }

  }
