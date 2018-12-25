import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';

@Injectable()
export class UtilityProvider {
  constructor(private toastCtrl: ToastController, private globalVars: GlobalVarsProvider) {

  }

  setAuthHeaders(response) {
      const jwtAccessToken = response.headers.get("Authorization");
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

  presentDismissableToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'OK',
      dismissOnPageChange: true
    });
    toast.present();
  }

  presentAutoDismissToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}
