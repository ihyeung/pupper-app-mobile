import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { StorageUtilities, Utilities, Users  } from '../../providers';
import { DEFAULT_IMG } from '../';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  image: string = DEFAULT_IMG;

  constructor(public navCtrl: NavController, public storageUtils: StorageUtilities,
              public userService: Users, public utils: Utilities) { }

    ionViewDidLoad() {
      this.storageUtils.clearStorage().then(() => {
        this.retrieveBreedList();
      });
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
        const headers = this.storageUtils.extractAndStoreAuthHeaders(response);
        const headersObj = this.storageUtils.createHeadersObjFromAuth(headers);
        this.utils.getBreeds(headersObj)
        .map(res => res.json())
        .subscribe(breedResponse => {
           this.storageUtils.storeData('breeds', breedResponse);

        }, err => console.error('ERROR: ', JSON.stringify(err)));
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }
  }
