import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-profileMain',
  templateUrl: 'profileMain.html',
})
export class ProfileMainPage {

  constructor(public navCtrl: NavController) {
    console.log('Constructor for main profile page');

  }

  retrieveMatchProfiles() {

  }

}
