import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, IonicPage } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { environment as ENV } from '../../environments/environment';
import { Utilities, Users, GlobalVars } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  breedList: any;

  constructor(public navCtrl: NavController, public utilService: Utilities,
    public statusBar: StatusBar, public userService: Users, private storage: Storage) {

      this.retrieveBreedList();
    }

    ionViewDidLoad() {}

    login(){
      this.navCtrl.push('LoginPage', { userAuthType: "log in" });
    }

    signup(){
      this.navCtrl.push('LoginPage', { userAuthType: "sign up" });
    }

    retrieveBreedList() {
      this.statusBar.show();

      this.userService
      .authenticateUser(ENV.VALIDATE_EMAIL_USER, ENV.VALIDATE_EMAIL_PASS)
      .subscribe(response => {

        const headers = this.utilService.extractAndStoreAuthHeaders(response);

        this.utilService.getBreeds(headers)
        .map(res => res.json())
        .subscribe(breedResponse => {
           this.utilService.storeBreeds(breedResponse);

          this.statusBar.hide();
        }, err => console.error('ERROR', err));
      }, err => console.error('ERROR', err));
    }
  }
