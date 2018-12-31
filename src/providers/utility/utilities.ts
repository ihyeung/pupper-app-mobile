import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
import { GlobalVars } from '../../providers/global/global-vars';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment';
import { Storage } from '@ionic/storage';

@Injectable()
export class Utilities {

  constructor(public globalVars: GlobalVars,
    public http: Http,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    private storage: Storage) { }

    storeUserAccount(account: any) {
      this.storage.set('account', account);
    }

    getUserAccountFromStorage() {
      return this.storage.get('account').then(val => {
        return val;
      });
    }

    storeBreeds(breeds: any) {
      this.storage.set('breeds', breeds);
    }

    getBreedsFromStorage() {
      return this.storage.get('breeds').then(val => {
        return val;
      });
    }

    extractAndStoreAuthHeaders(response) {
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': response.headers.get('Authorization')
      }
      this.storage.set('authHeaders', authHeaders);
      return authHeaders;
    }

    getAuthHeadersFromStorage() {
      return this.storage.get('authHeaders').then(val => {
        // const jsonType = val['Content-Type'];
        // const jwt = val['Authorization'];
        return val;
      });
    }

    storeUserProfile(userProfileObj) {
      this.storage.set('user', userProfileObj);
    }

    getUserFromStorage() {
        return this.storage.get('user').then(val => {return val;});
    }

    storeMatchProfile(matchProfileObj) {
      this.storage.set('match', matchProfileObj);
    }

    getMatchProfileFromStorage() {
        return this.storage.get('match').then(val => {return val;});
    }

    createHeadersObjFromAuth(authHeadersFromStorage) {
      const jsonType = authHeadersFromStorage['Content-Type'];
      const jwt = authHeadersFromStorage['Authorization'];

      return new Headers({ 'Content-Type': jsonType, 'Authorization': jwt });
    }

    getCurrentDateInValidFormat() {
      const today = new Date();
      //Months are 0 indexed so increment month by 1
      const monthVal = today.getMonth() + 1;
      const monthString = monthVal < 10 ? "0" + monthVal : monthVal;
      const dayString = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      return today.getFullYear() + "-" + monthString + "-" + dayString;
    }

    convertUtcTimestampToDate(utcString) {
    }

    getBreeds(headers) {
      return this.http.get(ENV.BASE_URL + '/breed', { headers: headers });
    }

    presentDismissableToast(message) {
      const toast = this.toastCtrl.create({
        message: message,
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'OK',
        dismissOnPageChange: true
      });
      toast.present();
    }

    presentAutoDismissToast(message) {
      const toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    }

    async presentLoadingIndicator() {
      const loader = await this.loadCtrl.create({
        content: "Please wait...",
        duration: 3000
      });
      return await loader.present();
    }

    displayAlertDialog(title, message, buttonLeft, buttonRight) {
      const dialog = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [
          { text: buttonLeft,
            handler: () => { return false; }
          },
          {
            text: buttonRight,
            handler: () => { return true; }
          }
        ]
      });
      dialog.present();
    }
  }
