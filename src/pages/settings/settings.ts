import { Component } from '@angular/core';
import { NavController, App, IonicPage } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { GlobalVars, Utilities } from '../../providers';
import { Storage } from '@ionic/storage';
// import { Users } from '../../providers/http/userProfiles';
// import { Matches } from '../../providers/http/matches';
// import { Messages } from '../../providers/http/messages';
// import { MatchProfiles } from '../../providers/http/matchProfiles';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public app: App,
    public globalVars: GlobalVars, public utilService: Utilities,
    private storage: Storage) {
    // public userService: Users, public matchProfService: MatchProfiles,
    // public matchService: Matches, public msgService: Messages) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  userProfile() {

  }

  matchProfile() {

  }

  logout() {
    const confirm = this.utilService.displayAlertDialog('Log out?',
    'Are you sure you want to log out?', 'Cancel','Confirm');
    // if (confirm) {
      console.log('logging out');
      this.storage.clear();
      this.returnToHomeScreen();
    // }

  }

  deleteAccount() {
    const confirmDelete = this.utilService.displayAlertDialog('Delete your account?',
    'Are you sure you want to delete your account? This action cannot be undone.',
    'Cancel','Delete my account');
    if (confirmDelete) {
      this.deleteAllUserData();
      this.storage.clear();
      this.returnToHomeScreen();
    }
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
    this.app.getRootNav().popToRoot();
  }

}
