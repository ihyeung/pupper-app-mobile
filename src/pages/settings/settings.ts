import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { DogProfilePage } from '../dogProfile/dogProfile';
import { environment as ENV } from '../../environments/environment';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public app: App) {
  }

  logout() {
    console.log("Logout Button Pressed on Settings Page");
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  myPupperProfile() {
    //TODO: JSON Request With Dog Profile Info
    console.log("My Pupper Profile Button Pressed on Settings Page");
    this.navCtrl.push(DogProfilePage, {});
  }
}
