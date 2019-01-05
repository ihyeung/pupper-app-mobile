import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage} from 'ionic-angular';
import { Http } from '@angular/http';
import { Utilities, Messages } from '../../providers';
import { environment as ENV } from '../../environments/environment';
import { DEFAULT_IMG } from '../';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  MESSAGE_PLACEHOLDER: string = 'Send a message...';
  message: string;
  chatMessages: any = [];
  fromMatchProfile: any = [];
  toMatchProfile: any = [];
  historyReady: boolean = false;
  chatProfileImage: string;
  authHeaders: any;
  profileReady: boolean = false;

  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public http: Http,
    public utilService: Utilities,
    public msgService: Messages) {
      //There are three ways this page can be accessed:
      //1. When viewing match profiles and a match is established, and the user elects to send a message (in this case, there will be no message history to retrieve)
      //2. When in messaging inbox page and user clicks on a message inbox preview for a convo with a given user (in this case, messages need to be retrieved)
      //3. Future implementation: matches tab of inbox page, clicking to view a match prfoile should have a send message button at the bottom (no message history to retrieve)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');

    this.utilService.getDataFromStorage('match').then(val => {
      if (!val) {
        this.navCtrl.push('CreateMatchProfilePage');
      } else {
      this.fromMatchProfile = val;
      this.extractNavParamData();
    }
  });

  }

  extractNavParamData() {
    this.toMatchProfile = this.navParams.get('matchProfileReceiver');
    if (!this.toMatchProfile) {
      console.log("ERROR RETRIEVING MATCH PROFILE RECEIVER");
      return;
    }
    this.chatProfileImage = this.toMatchProfile['profileImage'] ?
                            this.toMatchProfile['profileImage'] : DEFAULT_IMG;

    this.profileReady = true;

    if (!this.navParams.get('newMatch')) { //Exclude routing from matching page mutual match dialog
      const recentMessages = this.navParams.get('messages');
      this.displayMessageHistory(recentMessages);
    }
  }

  displayMessageHistory(recentMessages) {
    recentMessages.forEach(msg => {

      const message = this.utilService.getMessageAgeFromTimestamp(msg['timestamp']);
      this.chatMessages.push({
        message: msg['message'],
        timestamp: message,
        incomingMessage: this.isIncomingMessage(msg)
      });
    });
    this.historyReady = true;
  }

  sendMessage() {
    const messageTimeStamp = this.utilService.isoStringToUTCTimestamp(new Date().toISOString());
    const messageTimeStampFormatted = this.utilService.getMessageAgeFromTimestamp(messageTimeStamp);

    this.msgService.sendMessage(this.fromMatchProfile, this.toMatchProfile, this.message,
      messageTimeStamp)
      .map(res => res.json())
      .subscribe(response => {
        console.log(response);
        if (response['isSuccess'] == 200) {

          this.chatMessages.push({
            message: this.message,
            timestamp: messageTimeStampFormatted,
            incomingMessage: false
          });
          this.message = this.MESSAGE_PLACEHOLDER;
        } else {
          console.log('Error sending message');
        }
      }, err => console.error('ERROR', err));

  }

  private isIncomingMessage(message: any) {
    const senderId = message['matchProfileSender']['id'];
    if (senderId == this.toMatchProfile['id']) {
      console.log('incoming message');
      return true;
    }
    else if (senderId == this.fromMatchProfile['id']) {
      console.log('outgoing message');
      return false;
    } else {
      console.error('isIncomingMessage ERROR');
      return null;
    }
  }
}
