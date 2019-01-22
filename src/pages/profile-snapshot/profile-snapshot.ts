import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { StorageUtilities, Utilities, MatchProfiles, Users } from '../../providers';
import { DEFAULT_USER_IMG, USER_PROFILE_ERROR, MATCH_PROFILE_ERROR } from '../';
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
  activeMatchProfileObj: any;
  hasMatchProfile: boolean = false;
  numMatchProfiles: number = 1;

  constructor(public navCtrl: NavController, public utils: Utilities,
    public storageUtils: StorageUtilities, public matchProfService: MatchProfiles,
    public dialogs: Dialogs, public users: Users) {}

    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfileSnapshotPage');
      this.loadProfileSnapshotData();
    }

    loadProfileSnapshotData() {
      this.storageUtils.getDataFromStorage('match').then(match => {
        if (!match) { //No match profile in storage yet (i.e., profile snapshot page from user login)
          this.storageUtils.getDataFromStorage('user').then(user => {
            if (!user) {
              this.utils.presentDismissableToast(USER_PROFILE_ERROR);
              this.navCtrl.push('CreateUserProfilePage');
            } else {
              this.initUserData(user);
              this.retrieveMatchProfilesForUser(user);
            }
          });
        } else { //Match profile retreived from storage (i.e., profile snapshot page from create match profile page)
          this.initUserData(match.userProfile);
          this.retrieveMatchProfilesForUser(match.userProfile);
        }
      });
    }

    initUserData(user: any) {
      this.welcome = `Welcome back, ${user['firstName']}!`;
      this.userProfileObj = user;
      this.image =
      this.utils.validateImageUri(user['profileImage'], DEFAULT_USER_IMG);
      this.userReady = true;
    }

    retrieveMatchProfilesForUser(user: any){
      this.matchProfService.getMatchProfiles(user)
      .map(res => res.json())
      .subscribe(resp => {
        console.log(resp);
        if (resp.isSuccess) {
        if (resp['matchProfiles'] === undefined || !resp['matchProfiles']) {
          console.log("No match profiles for user");
          this.numMatchProfiles = 0;
          this.promptCreateMatchProfile();
        } else {
          console.log('Number fo match profiles for this user: ' + resp['matchProfiles'].length);
          this.numMatchProfiles = resp['matchProfiles'].length;
          this.matchProfilesList = resp['matchProfiles'];

          this.matchProfilesList.forEach(profile => {
            console.log(profile);
            if (profile['isDefault']) {
              console.log('found active match profile');
              this.activeMatchProfileObj = profile;
            }
          });

          this.storageUtils.storeData('profiles', this.matchProfilesList);

          if (this.activeMatchProfileObj === undefined || !this.activeMatchProfileObj) { //No active match profile set, default to first
            console.log("no active match profile found, set to first profile in list");
            this.activeMatchProfileObj = this.matchProfilesList[0]; //Set default to first result for now
            this.activeMatchProfileObj['isDefault'] = true;
            this.updateMatchProfile(this.activeMatchProfileObj);
          }
          this.storageUtils.storeData('match', this.activeMatchProfileObj); //Replace stored match profile with activeMatchProfile

          this.hasMatchProfile = true;
          this.matchProfileReady = true;
        }
      }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    updateMatchProfile(matchProfile: any) {
      const userId = matchProfile['userProfile']['id'];

      this.matchProfService.updateMatchProfile(matchProfile, userId)
      .map(res => res.json())
      .subscribe(resp => {
        if (!resp.isSuccess) {
          console.log(resp);
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    matchProfileModal(readOnly: boolean) {
      if (this.hasMatchProfile) {
        this.navCtrl.push('MatchProfileDetailPage', {
          readOnly : readOnly,
          matchProfiles: this.matchProfilesList,
          matchProfile: this.activeMatchProfileObj
        });
      } else {
        this.promptCreateMatchProfile();
      }
    }

    private promptCreateMatchProfile() {
      this.utils.presentDismissableToast(MATCH_PROFILE_ERROR);
      this.navCtrl.push('CreateMatchProfilePage');
    }

    createMatchProfile() {
      if (!this.matchProfilesList || this.matchProfilesList.length < 3) {
        this.navCtrl.push('CreateMatchProfilePage');
      } else {
        this.utils.presentAutoDismissToast('A maximum of 3 matching profiles can be created for a given user.');
      }
    }

    deleteActiveMatchProfile() {
      if (this.numMatchProfiles == 0) {
        console.error("Error: trying to delete invalid match profile");
      }
      const message = `Are you sure you want to delete ${this.activeMatchProfileObj['names']}'s match profile ? This action cannot be undone.`;
      const title = `Delete ${this.activeMatchProfileObj['names']}'s matching profile?`;
      this.dialogs.prompt(message, title, ['Confirm', 'Cancel'],
      'Enter the name associated with this matching profile to confirm.')
      .then(obj => {
        if (obj.buttonIndex != 1) { //Cancel button pressed or user clicked outside dialog box
          return;
        }
        if (obj.input1 === undefined || !obj.input1 || obj.input1 != this.activeMatchProfileObj['names']) {
          console.log('does not match');
        } else {
          console.log('deleting matching profile ', this.activeMatchProfileObj['names']);

          //TODO: DELETE MATCH_RESULT AND PUPPER_MESSAGES LINKED TO THIS MATCH PROFILE FIRST
          this.deleteMatchProfileData();

          this.matchProfService.deleteMatchProfileById(this.userProfileObj['id'],
          this.activeMatchProfileObj['id'])
          .map(res => res.json())
          .subscribe(resp => {
            console.log(resp);
            if (resp.isSuccess) {
              this.utils.presentDismissableToast(`${this.activeMatchProfileObj['names']}'s matching profile successfully deleted.`);
              this.updateActiveMatchProfile();
            }

          }, err => console.error('ERROR: ', JSON.stringify(err)));
        }
      })
      .catch(e => console.log('Error displaying dialog', e));
    }

    updateActiveMatchProfile() {
      if (this.numMatchProfiles == 1) { //Deleted the only match profile for user
        this.storageUtils.storeData('match', null);
        this.activeMatchProfileObj = null;
        this.hasMatchProfile = false;
        this.numMatchProfiles = 0;
        this.storageUtils.storeData('profiles', null);
      } else { //Deleted match profile but others for user still remain
        const activeId = this.activeMatchProfileObj['id'];
        this.matchProfilesList.filter(profile => profile['id'] != activeId);
        this.storageUtils.storeData('profiles', this.matchProfilesList);
        this.activeMatchProfileObj = this.matchProfilesList[0]; //Replace with next profile in list
        this.storageUtils.storeData('match', this.activeMatchProfileObj);
        this.numMatchProfiles--;
        this.setNewDefaultMatchProfile();
      }
    }

    setNewDefaultMatchProfile() {
      this.activeMatchProfileObj['isDefault'] = true;
      const userId = this.activeMatchProfileObj['userProfile']['id'];
      this.matchProfService.updateMatchProfile(this.activeMatchProfileObj, userId)
      .map(res => res.json())
      .subscribe(response => {
        console.log(response);
        if (response.matchProfiles) {
          const matchProfileObj = response['matchProfiles'][0];
          this.storageUtils.storeData('match', matchProfileObj); //Update user obj in storage
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
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
        if (obj.input1 === undefined || !obj.input1 || !zipRegEx.test(obj.input1)) {
          this.utils.presentDismissableToast("Please enter a valid US 5-digit zip code.");
          console.log('Invalid zipcode');
          return;
        }

        console.log('updating zip code from {} to {}', this.userProfileObj['zip'], obj.input1);
        let updatedUserObj = this.userProfileObj;
        updatedUserObj['zip'] = obj.input1;
        this.users.updateUserProfileById(updatedUserObj, this.userProfileObj['id'])
        .map(res => res.json())
        .subscribe(resp => {
          if(resp['isSuccess']) {
            console.log('zip code successfully updated');
            this.userProfileObj = updatedUserObj;
            this.storageUtils.storeData('user', this.userProfileObj);
            this.utils.presentDismissableToast(`Profile zip code location updated to '${obj.input1}'`);
          } else {
            console.log(resp);

          }
        }, err => console.error('ERROR UPDATING USER ZIP CODE: ', JSON.stringify(err)));
      }).catch(e => console.log('Error displaying dialog: ', JSON.stringify(e)));
    }

  }
