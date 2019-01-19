import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, IonicPage } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { environment as ENV } from '../../environments/environment';
import { Utilities, Users  } from '../../providers';
import { DEFAULT_IMG } from '../';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  image: string = DEFAULT_IMG;
  breedList: any;

  constructor(public navCtrl: NavController, public utils: Utilities,
    public statusBar: StatusBar, public userService: Users, private storage: Storage) {

      this.retrieveBreedList();
    }

    ionViewDidLoad() {
      this.utils.clearStorage();
    }

    login(){
      this.navCtrl.push('LoginPage', { userAuthType: "log in" });
    }

    signup(){
      this.navCtrl.push('LoginPage', { userAuthType: "sign up" });
    }

    retrieveBreedList() {
      this.userService
      .authenticateUser(ENV.VALIDATE_EMAIL_USER, ENV.VALIDATE_EMAIL_PASS)
      .subscribe(response => {
        const headers = this.utils.extractAndStoreAuthHeaders(response);

        this.utils.getBreeds(this.utils.createHeadersObjFromAuth(headers))
        .map(res => res.json())
        .subscribe(breedResponse => {
           this.utils.storeData('breeds', breedResponse);

        }, err => console.error('ERROR: ', err.body));
      }, err => console.error('ERROR: ', err.body));
    }
  }
