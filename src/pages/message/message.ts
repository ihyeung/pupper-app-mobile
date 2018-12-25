import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {

  allMessages = [];
  messageToSend = [];
  matchProfileReceiver: any;
  matchProfileSender: any;
  message: string;
  timestamp: "2018-12-03T03:02:36Z"; //"yyyy-MM-dd’T’HH:mm:ss’Z'"
  sendFrom: any;
  sendTo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController,
    public http: Http, public globalVarsProvider: GlobalVarsProvider) {
      console.log('Constructor for message page');

  }

  onSendBtnClick() {
    const receiverUserProfileId = 2;
    const senderId = this.globalVarsProvider.getUserProfileObj()['id'];
    if (null == this.globalVarsProvider.getMatchProfileObj()) {
      console.log('No match profile is stored in global vars, need to retrieve it');
      this.retrieveMatchProfilesAndSendMessage(senderId, receiverUserProfileId);

    } else {
      //already have the  match profile, just need to retrieve receiver match profile
      this.retrieveMatchProfileReceiver(receiverUserProfileId);
    }
    this.message = "TEST MESSAGE";
  }

  retrieveMatchProfilesAndSendMessage(senderUserProfileId, receiverUserProfileId) {
    const getMatchProfileEndpointUrl = ENV.BASE_URL + "/user/" + senderUserProfileId + "/matchProfile";

    console.log("Hitting endpoint to retrieve match profile for a given user id: " + getMatchProfileEndpointUrl);
    this.http.get(getMatchProfileEndpointUrl, { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(response => {

        if (response['status'] == 200) {
          let jsonResponseObj = JSON.parse((response['_body']));
          let matchProfileObj = jsonResponseObj['matchProfiles'][0];
          this.globalVarsProvider.setMatchProfileObj(matchProfileObj);
          this.retrieveMatchProfileReceiver(receiverUserProfileId);
        }
      },
        error => console.log(error)
      );
  }

  retrieveMatchProfileReceiver(receiverUserProfileId) {
    const getMatchProfileEndpointUrl = ENV.BASE_URL + "/user/" + receiverUserProfileId + "/matchProfile";
    console.log("Hitting endpoint to retrieve match profile for a given user id: " + getMatchProfileEndpointUrl);
    this.http.get(getMatchProfileEndpointUrl, { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(response => {
        if (response['status'] == 200) {
          let jsonResponseObj = JSON.parse((response['_body']));
          let matchProfileObj = jsonResponseObj['matchProfiles'][0];

          this.sendMessageToMatch(matchProfileObj);

        }
      },
        error => console.log(error)
      );
  }

  sendMessageToMatch(matchProfileReceiverObj) {
    this.sendFrom = 1;
    this.sendTo = 2;

    let pupperMessageBody = JSON.stringify({
      matchProfileReceiver: matchProfileReceiverObj,
      matchProfileSender: this.globalVarsProvider.getMatchProfileObj(),
      message: this.message,
      timestamp: null
    });

    const sendMessageUrl = ENV.BASE_URL + "/message?sendFrom=" +
      this.sendFrom + "&sendTo=" + this.sendTo;

    this.http.post(sendMessageUrl, pupperMessageBody,
      { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(response => {
        const jsonResponseObj = JSON.parse((response['_body']));
        if (jsonResponseObj['isSuccess'] == 200) {
          console.log("Message successfully sent.");
        }

      }, error => console.log(error)
      );
  }

  presentToast(msgToDisplay) {
    let toast = this.toastCtrl.create({
      message: msgToDisplay,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }
}
