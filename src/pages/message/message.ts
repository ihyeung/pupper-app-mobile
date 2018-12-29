import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage} from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { UtilityProvider } from '../../providers/utility/utilities';
import { environment as ENV } from '../../environments/environment';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {

  chatMessages: any = [];
  matchProfileReceiverObj: any;
  matchProfileSenderObj: any;
  // message: string;
  sendFrom: any;
  sendTo: any;
  historyReady: boolean = false;

  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public http: Http,
    public globalVarsProvider: GlobalVarsProvider,
    public utilService: UtilityProvider) {
      //There are three ways this page can be accessed:
      //1. When viewing match profiles and a match is established, and the user elects to send a message (in this case, there will be no message history to retrieve)
      //2. When in messaging inbox page and user clicks on a message inbox preview for a convo with a given user (in this case, messages need to be retrieved)
      //3. Future implementation: matches tab of inbox page, clicking to view a match prfoile should have a send message button at the bottom (no message history to retrieve)

      if (navParams.get('newMatch') === undefined || !navParams.get('newMatch')) {
        // displayMessageHistory(messagesFromNavParams);
        console.log('nav param newMatch undefined, retrieving message history');
      } else {
        //Scenario #1
        this.matchProfileSenderObj = this.globalVarsProvider.getMatchProfileObj();
        this.matchProfileReceiverObj = this.navParams.get('matchProfileReceiver');
      }
  }

  displayMessageHistory(messagesFromNavParams) {
    const activeMatchProfile = this.globalVarsProvider.getMatchProfileObj();
    messagesFromNavParams.forEach(msg => {

      // if (messagesFromNavParams['matchProfileSender']['id'] == activeMatchProfile['id']) {
          //Current user sent this message
          let senderId = activeMatchProfile['id'];
          let senderName = activeMatchProfile['names'];
          let senderImage = activeMatchProfile['profileImage'] == null ? 'assets/img/appLogo.png' : activeMatchProfile['profileImage'];
      // }
      // else if (messagesFromNavParams['matchProfileReceiver']['id'] == activeMatchProfile['id']){

      if (messagesFromNavParams['matchProfileReceiver']['id'] == activeMatchProfile['id']){
        senderId = messagesFromNavParams['matchProfileSender']['id'];
        senderName = messagesFromNavParams['matchProfileSender']['names'];
        senderImage = messagesFromNavParams['matchProfileSender']['profileImage'] == null ?
        'assets/img/appLogo.png' :
        messagesFromNavParams['matchProfileSender']['profileImage'];
      }
      this.chatMessages.push({
        senderMatchProfileId: senderId,
        senderMatchProfileName: senderName,
        image: senderImage,
        message: msg['message'],
        timestamp: msg['timestamp']
      });
    });

    this.historyReady = true;
  }

  sendMessage(message) {
    const receiverUserProfileId = 2;
    const senderId = this.globalVarsProvider.getUserProfileObj()['id'];
    if (null == this.globalVarsProvider.getMatchProfileObj()) {
      //Theoretically this should never happen at this point
      this.noMatchProfileFoundHandler();
    } else {
      //already have the  match profile, just need to retrieve receiver match profile

      this.retrieveReceiverAndSendMessage(receiverUserProfileId, message);
    }
  }

  retrieveReceiverAndSendMessage(receiverUserProfileId, message) {
    const getMatchProfileEndpointUrl = ENV.BASE_URL + "/user/" + receiverUserProfileId + "/matchProfile";
    console.log("Hitting endpoint to retrieve match profile for a given user id: " + getMatchProfileEndpointUrl);
    this.http.get(getMatchProfileEndpointUrl, { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(response => {
        if (response['status'] == 200) {
          let jsonResponseObj = JSON.parse((response['_body']));
          let matchProfileObj = jsonResponseObj['matchProfiles'][0];

          this.sendMessageByMatchProfileReceiverObj(matchProfileObj, message);
        }
      },
        error => console.log(error)
      );
  }

  sendMessageByMatchProfileReceiverObj(matchProfileReceiverObj, message) {
    this.sendFrom = 1;
    this.sendTo = 2;

    const messageTimeStamp = new Date().toISOString();
    console.log('message timestamp: ' + messageTimeStamp);

    let requestBody = JSON.stringify({
      matchProfileReceiver: matchProfileReceiverObj,
      matchProfileSender: this.globalVarsProvider.getMatchProfileObj(),
      message: message,
      timestamp: messageTimeStamp
    });

    const sendMessageUrl = ENV.BASE_URL + "/message?sendFrom=" +
      this.sendFrom + "&sendTo=" + this.sendTo;

    this.http.post(sendMessageUrl, requestBody,
      { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(response => {
        const jsonResponseObj = JSON.parse((response['_body']));
        if (jsonResponseObj['isSuccess'] == 200) {
          console.log("Message successfully sent.");
        }
          this.chatMessages.push({
            receiverName: matchProfileReceiverObj['names'],
            image: matchProfileReceiverObj['profileImage'] == null ?
                  'assets/img/appLogo.png' : matchProfileReceiverObj['profileImage'],
            message: message,
            timestamp: messageTimeStamp
          });

      }, error => console.log(error)
      );
  }

  noMatchProfileFoundHandler() {
      const createMatchProfile = this.utilService.displayAlertDialog(
      'Create a matching profile?',
      'Please create a matching profile to begin matching.',
      'Cancel',
      'Create match profile');
      if (createMatchProfile) {
        this.navCtrl.push('CreateMatchProfilePage');
      } else {
        this.navCtrl.push('ProfileMainPage');
      }
    }
}
