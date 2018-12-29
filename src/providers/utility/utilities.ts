import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class UtilityProvider {
  constructor(public globalVars: GlobalVarsProvider,
    public http: Http,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public loadCtrl: LoadingController) { }

    setAuthHeaders(response) {
      const jwtAccessToken = response.headers.get('Authorization');
      let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': jwtAccessToken });
      this.globalVars.setAuthHeaders(headers);
      return headers;
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

    presentLoadingIndicator() {
      const loader = this.loadCtrl.create({
        content: "Please wait...",
        duration: 3000
      });
      loader.present();
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
