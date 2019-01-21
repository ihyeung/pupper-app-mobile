import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
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
     public userService: Users) {
  }

    ionViewDidLoad() {
      this.utils.clearStorage().then(() => {
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
        const headers = this.utils.extractAndStoreAuthHeaders(response);
        console.log('Headers object: ' + JSON.stringify(headers));
        const headersObj = this.utils.createHeadersObjFromAuth(headers);
        console.log('Auth headers converted to Headers data type, auth token: ' + headersObj.get('Authorization'));
        this.utils.getBreeds(headersObj)
        .map(res => res.json())
        .subscribe(breedResponse => {
           this.utils.storeData('breeds', breedResponse);

        }, err => console.error('ERROR: ', JSON.stringify(err)));
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }
  }
