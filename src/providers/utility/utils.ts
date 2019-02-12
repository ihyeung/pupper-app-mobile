import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class Utilities {

  constructor(
    public http: Http,
    private toastCtrl: ToastController, private alertCtrl: AlertController) { }

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
        timestamp = timestamp + 'Z';
      }
      if (timestamp.indexOf('T') == -1) {
        timestamp = timestamp.replace(' ', 'T');
      }
      console.log('Timestamp to be converted to date: ' + timestamp);
      return new Date(timestamp);
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

    getBreeds(headers: any) {
      const url = `${ENV.BASE_URL}/breed`;
      console.log(url);
      return this.http.get(url, { headers: headers });
    }

    validateImageUri(imageUri: string, defaultImg: string) {
      if (imageUri === undefined || !imageUri) {
        console.log('Error: undefined or null');
        return defaultImg;
      }
      if (!(imageUri.startsWith("https://") || imageUri.startsWith("http://"))) {
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

    getHistoricalAgeFromTimestamp(timestamp: Date) {
      const now = new Date().getTime();
      const difference = now - timestamp.getTime();
      console.log("Difference: " + difference);
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      if (difference >= ONE_DAY_MS) {
        const days = Math.round(difference/ONE_DAY_MS);
        if (days >= 14) {
          const weeks = Math.round(days/7);
          const weekUnits = this.formatTimeUnits('weeks', weeks);
          return `${weeks} ${weekUnits} ago`;
        }
        const dayUnits = this.formatTimeUnits('days', days);
        return `${days} ${dayUnits} ago`;
      }
      else {
        if (difference >= ONE_DAY_MS/24) {
          const hours = Math.round(difference/(ONE_DAY_MS/24));
          const hourUnits = this.formatTimeUnits('hours', hours);

          return `${hours} ${hourUnits} ago`;
        } else {
          const min = Math.round(difference/(ONE_DAY_MS/(24*60)));
          const minUnits = this.formatTimeUnits('minutes', min);
          return `${min} ${minUnits} ago`;
        }
      }
    }

    formatTimeUnits(units: string, count: number) {
      return count == 1 ? units.substring(0, units.length - 1) : units;
    }

    presentAlert(message: string) {
      const alert = this.alertCtrl.create({
        message: message,
        buttons: [ {
        text: 'OK',
        handler: () => {
          console.log('OK CLICKED');
        }
      }],
      enableBackdropDismiss: false
      });

      return alert;
    }

    presentToast(message) {
      const toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    }
}
