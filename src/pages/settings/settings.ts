import { Component } from '@angular/core';
import { NavController, App, IonicPage, ModalController } from 'ionic-angular';
import { StorageUtilities, Utilities, Matches, MatchProfiles, Users, Messages } from '../../providers';
import { Dialogs } from '@ionic-native/dialogs';
import { UserProfileDetailPage } from '../user-profile-detail/user-profile-detail';
import {MATCH_PROFILE_ERROR} from "../index";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  matchProfileObj: any = [];
  userObj: any = [];
  matchProfilesList: any = [];
  matchPreferences: any = []; //match preferences for default match profile
  hideProfile: boolean = false;
  showSimilar: boolean = false;
  size: any = [];
  energy: any = [];
  age: any = [];
  searchRadius: number;
  timezone: string;

  deleteCount = 0;

  constructor(public navCtrl: NavController, public app: App,
    private storage: StorageUtilities, private dialog: Dialogs,
    private matches: Matches, private matchProfiles: MatchProfiles,
    private users: Users, private msgs: Messages, private utils: Utilities,
    public modal: ModalController) { }


    ionViewDidLoad() {
      console.log('ionViewDidLoad SettingsPage');
      this.retrieveDataFromStorage();
    }

    retrieveDataFromStorage() {
      this.storage.getDataFromStorage('match').then(val => {
        if (!val) {
          console.log("Error: no default match profile was retrieved from storage");
        } else {
          this.matchProfileObj = val;
          this.userObj = val['userProfile'];
        }
      });

      this.storage.getDataFromStorage('preferences').then(val => {
        if (!val) {
          console.log("No matching preferences found in storage");
          if (this.matchProfileObj) {
            console.log('Making http call to retrieve matching preferences for match profile id =' + this.matchProfileObj.id);
            this.getMatchPreferencesForDefaultMatchProfile(this.matchProfileObj.id);
          }
        } else {
          this.matchPreferences = val;
        }
      });

      this.storage.getDataFromStorage('matchProfiles').then(val => {
        this.matchProfilesList = val;
      });
    }

    getMatchPreferencesForDefaultMatchProfile(matchProfileId: number) {
      this.matchProfiles.getMatchProfileByMatchProfileId(matchProfileId)
      .map(res => res.json())
      .subscribe(response => {
        console.log(JSON.stringify(response));
        if (response.isSuccess) {
          this.matchPreferences = response['matchPreferences'];
          console.log(JSON.stringify(this.matchPreferences));
          this.storage.storeData('preferences', this.matchPreferences);
        }
      }
      , err => console.error('ERROR: ', JSON.stringify(err)));
    }

    updateActiveMatchProfile() {
      if (!this.matchProfileObj) {
        console.log('No active match profile: either no match profiles for user, or none of the existing match profiles were marked as default');
        this.promptCreateProfile(MATCH_PROFILE_ERROR, 'CreateMatchProfilePage');
      } else {
        console.log('total number of match profiles: ' + this.matchProfilesList.length);
        this.navCtrl.push('MatchProfileDetailPage', {
          readOnly : true,
          matchProfiles: this.matchProfilesList
        });
      }
    }

    editUserProfile() {
      this.dialog.alert('User Profile button clicked')
      .then(() => {
        console.log('Dialog dismissed');
        this.profileModal(false);
      })
      .catch(e => console.log('Error displaying dialog', e));
    }

    viewActiveMatchProfile() {
      this.navCtrl.push('MatchProfileDetailPage', {
        matchProfiles: [this.matchProfileObj],
        readOnly : false
      });
    }

    saveMatchProfileSettings() {
      this.dialog.alert('Match Profile button clicked')
      .then(() => {
        console.log('Dialog dismissed');
      })
      .catch(e => console.log('Error displaying dialog', e));
    }

    saveUserSettings() {

    }

    logout() {
      this.dialog.confirm('Are you sure you want to log out?', 'Log out')
      .then(index => {
        if (index == 1) {
          console.log('log out button clicked');
          this.returnToHomeScreen();
        }
      }).catch(e => console.error('Error displaying dialog: ', e));
    }

    deleteAccount() {
      if (!this.userObj) {
        console.log('null user object, delete of user data failed');
        return;
      }
      const placeholder = 'Enter your account email';
      this.dialog.prompt(
        'Are you sure you want to permanently delete your account and all associated user data?'+
        'This action cannot be undone. Enter your account email below and click to confirm.',
        'Delete Account', ['Confirm', 'Cancel'], placeholder)
        .then(obj => {
          if (obj.buttonIndex != 1) {
            return;
          }
          if (obj.input1 === undefined || !obj.input1 || obj.input1.indexOf(placeholder) >= 0 ||
          obj.input1 != this.userObj['userAccount']['username']) {
            let alert = this.utils.presentAlert('Error: The email address entered was invalid. Please try again.');
            alert.present();
          } else {
            this.deleteAllUserData();
            this.returnToHomeScreen();
          }
        })
        .catch(e => console.error('Error displaying dialog: ', e));
      }

      deleteAllUserData() {
        console.log('IMPLEMENTATION IS INCOMPLETE');

        if (!this.matchProfilesList || this.matchProfilesList.length == 0 || !this.userObj) {
          console.log('error deleting all user data: match profile list is null or empty, or user object is null');
          return;
        }
        this.matchProfilesList.forEach(matchProfile => {
          this.deleteMatchPreferences(matchProfile['id']);
        });
      }

      returnToHomeScreen() {
        this.storage.clearStorage();

        this.app.getRootNav().setRoot('HomePage');
        // this.app.getRootNav().popToRoot();
        //this.app.getRootNavById(); //TODO: update the above deprecated call
      }

      private promptCreateProfile(error: string, navTo: string) {
        let alert = this.utils.presentAlert(error);
        alert.present();
        alert.onDidDismiss(() => {
          this.navCtrl.push(navTo);
        });
      }

      async profileModal(readOnly: boolean) {

        const modal = await this.modal.create(UserProfileDetailPage, { readOnly: readOnly });
        return await modal.present();
      }

      deleteMatchPreferences(matchProfileId: number) {

        this.matchProfiles.deleteMatchPreferences(matchProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(JSON.stringify(response));
          if (response.isSuccess) {
            console.log('match preferences deleted for matchProfileId=' + matchProfileId);
            this.deleteMessages(matchProfileId);
          }
        }
        , err => console.error('ERROR: ', JSON.stringify(err)));
      }

      deleteMessages(matchProfileId: number) {
        this.msgs.deleteMessagesForMatchProfile(matchProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(JSON.stringify(response));
          if (response.isSuccess) {
            console.log('messages deleted for matchProfileId=' + matchProfileId);
            this.deleteMatchResults(matchProfileId);
          }
        }
        , err => console.error('ERROR: ', JSON.stringify(err)));
      }

      deleteMatchResults(matchProfileId: number) {
        this.matches.deleteMatchResultsForMatchProfile(matchProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(JSON.stringify(response));
          if (response.isSuccess) {
            console.log('match result data deleted for matchProfileId=' + matchProfileId);
            this.deleteCount++;
            if (this.deleteCount == this.matchProfilesList.length) {
              //Only delete match profiles after all message/preference/matchresult
              //data referencing the match profiles to delete has been deleted
              console.log('finished deleting message, match_preferences, and match_result data for all match profiles');

              this.deleteMatchProfiles();
            }
          }
        }
        , err => console.error('ERROR: ', JSON.stringify(err)));
      }

      deleteMatchProfiles() {
        this.matchProfiles.deleteAllMatchProfilesByUserId(this.userObj['id'])
        .map(res => res.json())
        .subscribe(resp => {
          console.log(JSON.stringify(resp));
          if (resp.isSuccess) {
            console.log('all match profiles created by user id =' + this.userObj['id'] + ' were successfully deleted');

            this.deleteUserProfile();
          }
        }, err => console.error("Error: ", JSON.stringify(err)));
      }

      deleteUserProfile() {
        this.users.deleteUserProfileByEmail(this.userObj['userAccount']['username'])
        .map(res => res.json())
        .subscribe(resp => {
          console.log(JSON.stringify(resp));
          //Delete user profile by user email endpoint returns void
            this.deleteUserAccount();
        }, err => console.error("Error: ", JSON.stringify(err)));
      }

      deleteUserAccount() {
        const email = this.userObj['userAccount']['email'];
        console.log('Delete user account corresponding to email = ' + email);
        this.users.deleteUserAccount(email)
        .map(res => res.json())
        .subscribe(resp => {
          console.log(JSON.stringify(resp));
          if (resp.isSuccess) {
            console.log('user account was successfully deleted');
          }
        }, err => console.error("Error: ", JSON.stringify(err)));
      }

      editAccount() {
        console.log('not implemented yet');
      }


    }
