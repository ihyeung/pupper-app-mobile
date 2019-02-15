import { Component } from '@angular/core';
import { NavController, App, IonicPage, ModalController } from 'ionic-angular';
import { StorageUtilities, Utilities, Matches, MatchProfiles, Users, Messages } from '../../providers';
import { Dialogs } from '@ionic-native/dialogs';
import { MATCH_PROFILE_ERROR } from '../';
import { UserProfileDetailPage } from '../user-profile-detail/user-profile-detail';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  matchProfileObj: any = [];
  userObj: any = [];
  matchProfileList: any = [];

  constructor(public navCtrl: NavController, public app: App,
    private storage: StorageUtilities, private dialog: Dialogs,
    private matches: Matches, private matchProfiles: MatchProfiles,
    private users: Users, private msgs: Messages, private utils: Utilities,
    public modal: ModalController) { }

    ionViewDidLoad() {
      console.log('ionViewDidLoad SettingsPage');
      this.storage.getDataFromStorage('match').then(val => {
        this.matchProfileObj = val;
        this.userObj = val['userProfile'];
      });

      this.storage.getDataFromStorage('profiles').then(val => {
        this.matchProfileList = val;
      });
    }

    updateActiveMatchProfile() {
      if (!this.matchProfileObj) {
        console.log('No active match profile was stored in storage, means no match profiles were found for user');
        this.promptCreateProfile(MATCH_PROFILE_ERROR, 'CreateMatchProfilePage');
      } else {
        console.log('total number of match profiles: ' + this.matchProfileList.length);
        this.matchProfileList.forEach(each => {
          if (each['id'] != this.matchProfileObj['id']) { //Only list other match profiles that are not the current default
            console.log('match profile: ' + each.names);

            //TODO: Display modal with brief match profile info with button to select as new active match profile
          }
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

    viewMatchProfile(profile: any) {
      this.navCtrl.push('MatchProfileDetailPage', { matchProfile: profile });
    }

    editMatchProfiles() {
      this.dialog.alert('Match Profile button clicked')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
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
      this.dialog.prompt(
        'Are you sure you want to permanently delete your account and all associated user data? This action cannot be undone.',
        'Delete Account', ['Confirm', 'Cancel'], 'Enter your account email to confirm.')
      .then(obj => {
        if (obj.buttonIndex != 1) {
          return;
        }
          if (obj.input1 === undefined || !obj.input1 ||
                      obj.input1 != this.userObj['userAccount']['username']) {
            console.log('Email address does not match');
          } else {
            this.deleteAllUserData();
            this.returnToHomeScreen();
          }
      })
      .catch(e => console.error('Error displaying dialog: ', e));
    }

    deleteAllUserData() {
      console.log('NOT IMPLEMENTED YET');

      //Required delete order (due to foreign key constraints):
      this.deleteMatchPreferences();
      this.deleteMessages();
      //1. delete all messages
      //1. delete match results
      //2. delete pupper profiles (if implemented)
      //3. delete match Profiles
      //4. delete user profile
      //5. delete user account
    }

    returnToHomeScreen() {
      this.storage.clearStorage();

      this.app.getRootNav().setRoot('HomePage');
      // this.app.getRootNav().popToRoot();
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

    deleteMatchPreferences() {
      this.matchProfiles.deleteMatchPreferences(this.matchProfileObj['id'])
      .map(res => res.json())
      .subscribe(response => {
        console.log(response);
        if (response.isSuccess) {
          console.log('match preferences deleted');
        }
      }
      , err => console.error('ERROR: ', JSON.stringify(err)));
    }

    deleteMessages() {

    }

    deleteMatchResults() {

    }

    deleteMatchProfiles() {

    }

    deleteUserProfile() {

    }


  }
