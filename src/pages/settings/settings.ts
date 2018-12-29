import { Component } from '@angular/core';
import { NavController, App, IonicPage } from 'ionic-angular';
import { CreateMatchProfilePage } from '../createMatchProfile/createMatchProfile';
import { environment as ENV } from '../../environments/environment';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { UtilityProvider } from '../../providers/utility/utilities';
// import { UsersProvider } from '../../providers/http/userProfiles';
// import { MatchesProvider } from '../../providers/http/matches';
// import { MessagesProvider } from '../../providers/http/messages';
// import { MatchProfilesProvider } from '../../providers/http/matchProfiles';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public app: App,
    public globalVars: GlobalVarsProvider, public utilService: UtilityProvider) {
    // public userService: UsersProvider, public matchProfService: MatchProfilesProvider,
    // public matchService: MatchesProvider, public msgService: MessagesProvider) {
    console.log('Constructor for settings page');
  }

  userProfile() {

  }

  matchProfile() {

  }

  logout() {
    const confirm = this.utilService.displayAlertDialog('Log out?',
    'Are you sure you want to log out?', 'Cancel','Confirm');
    if (confirm) {
      this.clearGlobalVars();
      this.returnToHomeScreen();
    }

  }

  deleteAccount() {
    const confirmDelete = this.utilService.displayAlertDialog('Delete your account?',
    'Are you sure you want to delete your account? This action cannot be undone.',
    'Cancel','Delete my account');
    if (confirmDelete) {
      this.deleteAllUserData();
      this.clearGlobalVars();
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

  clearGlobalVars() {
    this.globalVars.setAuthHeaders(null);
    this.globalVars.setUserProfileObj(null);
    this.globalVars.setMatchProfileObj(null);
  }

  returnToHomeScreen() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

}
