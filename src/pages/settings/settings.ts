import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { CreateMatchProfilePage } from '../createMatchProfile/createMatchProfile';
import { environment as ENV } from '../../environments/environment';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public app: App) {
    console.log('Constructor for settings page');
  }

  userProfile() {

  }

  matchProfile() {
    
  }

  logout() {
    console.log("Logout Button Pressed on Settings Page");
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  deleteAccount() {

  }

}
