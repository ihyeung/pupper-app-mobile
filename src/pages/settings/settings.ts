import { Component } from '@angular/core';
import { NavController, App, IonicPage, AlertController } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { Utilities } from '../../providers';
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
    public alertCtrl: AlertController,
    private utils: Utilities, private dialog: Dialogs) { }

    ionViewDidLoad() {
      console.log('ionViewDidLoad SettingsPage');
      this.utils.getDataFromStorage('match').then(val => {
        this.matchProfileObj = val;
        this.userObj = val['userProfile'];
      });
    }

    updateActiveMatchProfile() {

    }

    userProfile() {
      this.dialog.alert('User Profile button clicked')
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
    }

    viewMatchProfile(profile: any) {
      this.navCtrl.push('MatchProfileDetailPage', { matchProfile: profile });
    }

    matchProfile() {

    }

    logout() {
      this.dialog.confirm('Are you sure you want to log out?', 'Log out')
      .then(index => {
        if (index == 1) {
          this.utils.clearStorage();
          this.returnToHomeScreen();
        }
      })
      .catch(e => console.log('Error displaying dialog', e));

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
            console.log('Deleting account (NOT IMPLEMENTED YET)');
            this.deleteAllUserData();
            this.utils.clearStorage();
            this.returnToHomeScreen();
          }
      })
      .catch(e => console.log('Error displaying dialog', e));
    }

    deleteAllUserData() {
      //Required delete order (due to foreign key constraints):
      //1. delete all messages
      //1. delete match results
      //2. delete pupper profiles (if implemented)
      //3. delete match Profiles
      //4. delete user profile
      //5. delete user account
    }

    returnToHomeScreen() {
      this.app.getRootNav().setRoot('HomePage');
      // this.app.getRootNav().popToRoot();
    }

  }
