import { Component } from '@angular/core';
import { NavController, IonicPage, ModalController } from 'ionic-angular';
import { StorageUtilities, Utilities, MatchProfiles, Users } from '../../providers';
import { DEFAULT_USER_IMG, USER_PROFILE_ERROR, MATCH_PROFILE_ERROR } from '../';
import { Dialogs } from '@ionic-native/dialogs';
import { UserProfileDetailPage } from '../user-profile-detail/user-profile-detail';


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
  matchProfilesList: any = [];
  activeMatchProfileObj: any;
  numMatchProfiles: number = 0;
  privateView: boolean = false; //Whether active user is accessing user/match detail pages linked to their own account

  constructor(public navCtrl: NavController, public utils: Utilities,
              public storageUtils: StorageUtilities, public matchProfService: MatchProfiles,
              public dialogs: Dialogs, public users: Users, public modal: ModalController) {}

  ionViewDidLoad() {
    this.loadDataFromStorage();
  }

  loadDataFromStorage() {
    this.storageUtils.getDataFromStorage('match').then(match => {
      if (match) {
        //Match profile retreived from storage (i.e., profile snapshot page from create match profile page where user created a default match profile)
        this.initUserData(match.userProfile);
        this.retrieveMatchProfilesForUser(match.userProfile);
      } else {
        //No match profile in storage yet (2 use cases):
        //1. Routed from user login
        //2. Routed after creating a new match profile that the user DID NOT mark as default/active match profile
        console.log('Failed to retrieve match profile from storage, will now attempt to retrieve user from storage');

        this.storageUtils.getDataFromStorage('user').then(user => {
          if (!user) {
            let alert = this.utils.presentAlert(USER_PROFILE_ERROR);
            alert.present();
            alert.onDidDismiss(() => {
              this.navCtrl.push('CreateUserProfilePage');
            });
          } else {
            this.initUserData(user);
            this.retrieveMatchProfilesForUser(user);
          }
        });
      }
    });
  }

  initUserData(user: any) {
    this.welcome = `Welcome back, ${user['firstName']}!`;
    this.userProfileObj = user;
    this.image = this.utils.validateImageUri(user['profileImage'], DEFAULT_USER_IMG);
    this.userReady = true;
  }

  retrieveMatchProfilesForUser(user: any){

    this.storageUtils.getDataFromStorage('matchProfiles').then(val => {
      if (val) { //May have been previously stored on login page
        this.matchProfilesList = val;
        console.log(JSON.stringify(this.matchProfilesList));
        this.numMatchProfiles = val.length;

        this.findAndStoreActiveMatchProfile();
      } else {
        console.log('Failed to retrieve list of match profiles from storage, making api call to retrieve match profiles by user id');
        this.matchProfService.getMatchProfilesByUserId(user['id'])
          .map(res => res.json())
          .subscribe(resp => {
            if (!resp.isSuccess ||
              (resp['matchProfiles'] === undefined || !resp['matchProfiles'])) {
              this.matchProfileNotFoundHandler();
            } else {
              this.numMatchProfiles = resp['matchProfiles'].length;
              this.matchProfilesList = resp['matchProfiles'];

              this.findAndStoreActiveMatchProfile();
            }
          }, err => console.error('ERROR: ', JSON.stringify(err)));
      }
    });
  }

  private findAndStoreActiveMatchProfile() {
    if (!this.matchProfilesList || this.numMatchProfiles == 0) {
      this.matchProfileNotFoundHandler();
    } else {

      this.matchProfilesList.forEach(profile => {
        if (profile['isDefault']) {
          console.log('found active match profile, setting as activeMatchProfileObj local var');
          this.activeMatchProfileObj = profile;

        }
      });

      if (this.activeMatchProfileObj === undefined || !this.activeMatchProfileObj) { //No active match profile set, default to first
        console.log('no match profile is marked as default, defaulting to first match profile in list');

        this.activeMatchProfileObj = this.matchProfilesList[0]; //Set default to first result for now
        this.activeMatchProfileObj['isDefault'] = true;
        this.setMatchProfileAsDefault(this.activeMatchProfileObj);
        if (!this.matchProfilesList[0]['isDefault']) {
          console.log('need to update reference to active match profile in match profile list before storing match profile list in storage');
        }
      }

      this.storageUtils.storeData('matchProfiles', this.matchProfilesList);
      this.storageUtils.storeData('match', this.activeMatchProfileObj); //Replace stored match profile with activeMatchProfile
    }
  }

  setMatchProfileAsDefault(matchProfile: any) {
    const userId = matchProfile['userProfile']['id'];

    this.matchProfService.updateMatchProfile(matchProfile, userId)
      .map(res => res.json())
      .subscribe(resp => {
        if (resp.isSuccess) {
          console.log(resp);
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
  }

  // matchProfileModal(readOnly: boolean) {
  matchProfileModal(matchProfile: any) { //'VIEW ACTIVE/DEFAULT' button is the only use case where a matchProfile object (the active/default) is passed in
    if (this.numMatchProfiles > 0) {
      this.navCtrl.push('MatchProfileDetailPage', {
        // readOnly : readOnly,
        matchProfiles: matchProfile ? [matchProfile] : this.matchProfilesList, //If matchProfile obj passed in, only pass this default using matchProfiles param
        privateView: this.privateView
      });
    } else {
      this.matchProfileNotFoundHandler();
    }
  }

  createMatchProfile() {
    if (!this.matchProfilesList || this.matchProfilesList.length < 3) {
      this.navCtrl.push('CreateMatchProfilePage');
    } else {
      let alert = this.utils.presentAlert('A maximum of 3 matching profiles can be created for a given user.');
      alert.present();
    }
  }

  deleteMatchProfileHandler(matchProfiles: any) {
    if (this.numMatchProfiles == 0 || !matchProfiles) {
      console.error("Error: trying to delete invalid match profile");
    }
    let profilesToDelete = `${this.activeMatchProfileObj['names']}'s match profile`;
    let deleteTitle = `${this.activeMatchProfileObj['names']}'s matching profile`;
    let confirm = 'the name associated with this matching profile';
    if (matchProfiles.length > 1) {
      console.log('deleteMatchProfile called on multiple match prfoiles, delete ALL');
      profilesToDelete = deleteTitle = 'all matching profiles for this user';
      confirm = 'the first name for this user';

    }
    const message = `Are you sure you want to delete ${profilesToDelete}? This action cannot be undone.`;
    const title = `Delete ${deleteTitle}?`;
    this.dialogs.prompt(message, title, ['Confirm', 'Cancel'],
      `Enter ${confirm} to confirm.`)
      .then(obj => {
        if (obj.buttonIndex != 1) { //Cancel button pressed or user clicked outside dialog box
          return;
        }
        if (obj.input1 === undefined || !obj.input1 || obj.input1 != this.activeMatchProfileObj['names']) {
          console.log('Invalid input');
          let alert = this.utils.presentAlert("Deletion of matching profile(s) failed. Please try again and enter the requested input correctly.");
          alert.present();
        } else {
          console.log('Deleting matching profile for ', this.activeMatchProfileObj['names']);

          this.deleteMatchProfileData(this.activeMatchProfileObj['id']);
        }
      })
      .catch(e => console.log('Error displaying dialog', e));
  }

  editActiveMatchProfile() {
    this.navCtrl.push('CreateMatchProfilePage',{
      formData: this.activeMatchProfileObj,
      isUpdate: true
    });
  }

  updateActiveMatchProfile() {
    console.log('Updating active match profile after deletion of active match profile was completed.');
    if (this.numMatchProfiles == 1) { //Deleted the only match profile for user
      this.clearMatchProfileData();

    } else { //Deleted match profile but others for user still remain
      const activeId = this.activeMatchProfileObj['id'];
      this.matchProfilesList = this.matchProfilesList.filter(profile => profile['id'] != activeId);
      this.activeMatchProfileObj = this.matchProfilesList[0]; //Replace with next profile in list

      this.storageUtils.storeData('matchProfiles', this.matchProfilesList);

      this.setNewDefaultMatchProfile();
    }
    this.numMatchProfiles--;
  }

  setNewDefaultMatchProfile() {
    this.activeMatchProfileObj['isDefault'] = true;
    const userId = this.activeMatchProfileObj['userProfile']['id'];
    this.matchProfService.updateMatchProfile(this.activeMatchProfileObj, userId)
      .map(res => res.json())
      .subscribe(response => {
        console.log(response);
        if (response.isSuccess && response.matchProfiles) {
          const matchProfileObj = response['matchProfiles'][0];
          this.storageUtils.storeData('match', matchProfileObj); //Update user obj in storage
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
  }

  async userProfileModal(readOnly: boolean) {
    const modal = await this.modal.create(UserProfileDetailPage, { readOnly: readOnly });
    return await modal.present();
  }

  deleteMatchProfileData(matchProfiles: any) {
    console.log('Deleting match_result and pupper_message and match_preference data');
    console.log("not implemented yet");
    //1. delete match_result records
    //2. delete pupper_message records

    matchProfiles.forEach(each => {
      console.log("Deleting match_profile for matchProfileId=" + each.id);

    });

    if (matchProfiles.length == 1) {
      this.matchProfService.deleteMatchProfileById(this.userProfileObj['id'], this.activeMatchProfileObj['id']);
      let alert = this.utils.presentAlert(`${this.activeMatchProfileObj['names']}'s matching profile successfully deleted.`);
      alert.present();

      this.updateActiveMatchProfile();
    }
    else {
      this.matchProfService.deleteAllMatchProfilesByUserId(this.userProfileObj['id'])
        .map(res => res.json())
        .subscribe(resp => {
          console.log(resp);
          if (resp.isSuccess) {

            this.clearMatchProfileData();

            let alert = this.utils.presentAlert(`All matching profiles associated with ${this.userProfileObj['firstName']}'s profile were successfully deleted.`);
            alert.present();

          } else {
            console.log('Error: attempt to delete match profiles for an invalid userId');
          }

        }, err => console.error('ERROR: ', JSON.stringify(err)));
    }
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
          let alert = this.utils.presentAlert("Please enter a valid US 5-digit zip code.");
          alert.present();
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
              let alert = this.utils.presentAlert(`Profile zip code location updated to '${obj.input1}'`);
              alert.present();
            } else {
              console.log(resp);

            }
          }, err => console.error('ERROR UPDATING USER ZIP CODE: ', JSON.stringify(err)));
      }).catch(e => console.log('Error displaying dialog: ', JSON.stringify(e)));
  }

  private matchProfileNotFoundHandler() {
    let alert = this.utils.presentAlert(MATCH_PROFILE_ERROR);
    alert.present();
    alert.onDidDismiss(() => {
      this.navCtrl.push('CreateMatchProfilePage');
    });
  }

  private clearMatchProfileData() {
    this.activeMatchProfileObj = null;
    this.storageUtils.removeDataFromStorage('matchProfiles');
    this.storageUtils.removeDataFromStorage('match');
    this.matchProfilesList = null;
  }


}
