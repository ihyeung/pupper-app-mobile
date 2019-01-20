import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment as ENV } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { DEFAULT_IMG, DEFAULT_USER_IMG } from '../../pages';

@Injectable()
export class Utilities {

  constructor(
    public http: Http,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private storage: Storage) { }

    clearStorage() {
      console.log("Clearing storage");
      this.storage.clear();
    }

    storeData(key: string, val: any) {
      this.storage.set(key, val);
    }

    getDataFromStorage(key: string) {
      return this.storage.get(key).then(val => {
        return val;
      });
    }

    getJwt() {
      return this.storage.get('authHeaders').then(val => {
        if (val) {
          return { 'Authorization': val['Authorization']};
        }
      });
    }

    getAuthHeaders() {
      return this.storage.get('authHeaders').then(val => {
        if (!val) {
          return null;
        }
        const type = val['Content-Type'];
        const jwt = val['Authorization'];

        return new Headers({ 'Content-Type': type, 'Authorization': jwt });
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

    createHeadersObjFromAuth(authHeadersFromStorage) {
      const jsonType = authHeadersFromStorage['Content-Type'];
      const jwt = authHeadersFromStorage['Authorization'];

      return new Headers({ 'Content-Type': jsonType, 'Authorization': jwt });
    }

    /*
    Generates today's date as a string with the format yyyy-MM-dd
    */
    currentDateToValidDateFormat() {
      const today = new Date();
      //Months are 0 indexed so increment month by 1
      const monthVal = today.getMonth() + 1;
      const monthString = monthVal < 10 ? "0" + monthVal : monthVal;
      const dayString = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      return today.getFullYear() + "-" + monthString + "-" + dayString;
    }

    /*
    Method that converts message or match timestamp (in utc or iso form)
    from back-end to a standardized timestamp.
    */
    convertTimestampToDate(timestamp: string) {
      if (timestamp.indexOf('Z') == -1) {
        return new Date(timestamp + 'Z');
      } else {
        return new Date(timestamp);
      }
    }

    /*
    Converts ISO timestamp of the format 2019-01-04T01:40:55.487Z to
    the format 2019-01-04 01:40:55.
    */
    isoStringToUTCTimestamp(isoStringDate: string) {
      if (isoStringDate.indexOf('.') == -1) {
        return isoStringDate;
      }
      return isoStringDate.replace('T', ' ').split('.')[0];
    }

    getBreeds(headers) {
      return this.http.get(`${ENV.BASE_URL}/breed`, { headers: headers });
    }

    validateImageUri(imageUri: string, defaultImg: string) {
      if (imageUri === undefined || !imageUri) {
        console.log('Error: undefined or null');
        return defaultImg;
      }
      else if (!imageUri.startsWith('https://') || !imageUri.startsWith('http://')) {
        console.log('Error: Invalid image URI, setting to default');
        return defaultImg;
      }
      const invalidPrefixes = ['https://goo.gl/images/', 'https://bit.ly/'];
      invalidPrefixes.forEach(each => {
        if (imageUri.startsWith(each)) {
          console.log('Error: Invalid URL shortened image URI');
          return defaultImg;
        }
      });
      return imageUri;
    }

    getMessageAgeFromTimestamp(timestamp: string) {
      const standardizedTimestamp = this.convertTimestampToDate(timestamp);
      const now = new Date().getTime();
      const difference = now - standardizedTimestamp.getTime();
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      if (difference >= ONE_DAY_MS) {
        const days = Math.round(difference/ONE_DAY_MS);
        if (days >= 14) {
          const weeks = Math.round(days/7);
          return `${weeks} weeks ago`;
        }
        return `${days} days ago`;
      }
      else {
        if (difference >= ONE_DAY_MS/24) {
          const hours = Math.round(difference/(ONE_DAY_MS/24));
          return `${hours} hours ago`;
        } else {
          const min = Math.round(difference/(ONE_DAY_MS/(24*60)));
          console.log('minutes: ' + min);
          return `${min} minutes ago`;
        }
      }
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

  }
