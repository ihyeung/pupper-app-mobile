import { Component } from '@angular/core';
import { NavController, App, IonicPage } from 'ionic-angular';
import { StorageUtilities } from '../../providers';
import { Dialogs } from '@ionic-native/dialogs';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  matchProfileObj: any = [];
  userObj: any = [];

  constructor(public navCtrl: NavController, public app: App,
    private utils: StorageUtilities, private dialog: Dialogs) { }

    ionViewDidLoad() {
      console.log('ionViewDidLoad SettingsPage');
      this.utils.getDataFromStorage('match').then(val => {
        this.matchProfileObj = val;
        this.userObj = val['userProfile'];
      });
    }

    updateActiveMatchProfile() {

    }

    editUserProfile() {
      this.dialog.alert('User Profile button clicked')
      .then(() => console.log('Dialog dismissed'))
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
      //1. delete all messages
      //1. delete match results
      //2. delete pupper profiles (if implemented)
      //3. delete match Profiles
      //4. delete user profile
      //5. delete user account
    }

    returnToHomeScreen() {
      this.utils.clearStorage();

      this.app.getRootNav().setRoot('HomePage');
      // this.app.getRootNav().popToRoot();
    }

  }
