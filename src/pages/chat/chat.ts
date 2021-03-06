import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Http} from '@angular/http';
import {Messages, StorageUtilities, Utilities} from '../../providers';
import {DEFAULT_IMG} from '../';

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
  toUser: any;
  fromUser: any;

  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public http: Http,
    public utils: Utilities,
    public storageUtils: StorageUtilities,
    public msgService: Messages) {
      //There are three ways this page can be accessed:
      //1. When viewing match profiles and a match is established, and the user elects to send a message (in this case, there will be no message history to retrieve)
      //2. When in messaging inbox page and user clicks on a message inbox preview for a convo with a given user (in this case, messages need to be retrieved)
      //3. Future implementation: matches tab of inbox page, clicking to view a match prfoile should have a send message button at the bottom (no message history to retrieve)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');

    this.storageUtils.getDataFromStorage('match').then(val => {
      if (!val) {
        this.navCtrl.push('CreateMatchProfilePage');
      } else {
      this.fromMatchProfile = val;
      this.fromUser = val['userProfile'];
      this.extractNavParamData();
    }
  });

  }

  extractNavParamData() {
    this.toMatchProfile = this.navParams.get('matchProfileReceiver');
    this.toUser = this.navParams.get('toUser');
    if (!this.toMatchProfile && !this.toUser) {
      console.log("ERROR: toUser or matchProfileReceiver must not be null");
      return;
    }
    if (this.toMatchProfile) {
      this.initMatchProfileChat();
    } else if (this.toUser) {
      this.initUserChat();
    }
  }

  private initMatchProfileChat() {
    console.log('Loading chat page between match profiles');
    this.chatProfileImage =
      this.utils.validateImageUri(this.toMatchProfile['profileImage'], DEFAULT_IMG);

    this.profileReady = true;

    if (!this.navParams.get('newMatch')) { //Exclude routing from matching page mutual match dialog
      const recentMessages = this.navParams.get('messages');

      this.displayMessageHistory(recentMessages);
    }
  }

  //TODO: Revisit this functionality in the future.
  private initUserChat() {
    console.log('loading chat page between users');
    this.chatProfileImage =
      this.utils.validateImageUri(this.toUser['profileImage'], DEFAULT_IMG);

    this.profileReady = true;

    this.msgService.retrieveUserMessages(this.fromUser['id'], this.toUser['id'])
      .map(res => res.json())
      .subscribe(response => {
        console.log(JSON.stringify(response));
        if (response['isSuccess']) {
          //TODO: extract messages from response then call this.displayMessageHistory()
        } else {
          console.log('Error sending message');
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
  }

  displayMessageHistory(recentMessages: any) {
    recentMessages.forEach(msg => {

      const standardizedTimeStamp = this.utils.convertTimestampToDate(msg['timestamp']);
      const messageAge = this.utils.getHistoricalAgeFromTimestamp(standardizedTimeStamp);
      this.chatMessages.push({
        message: msg['message'],
        timestamp: messageAge,
        incomingMessage: this.isIncomingMessage(msg)
      });
    });
    this.historyReady = true;
  }

  typeMessage() {
    this.message = '';
  }

  sendMessage() {
    const messageTimeStamp = this.utils.isoStringToUTCTimestamp(new Date().toISOString());
    const standardizedTimeStamp = this.utils.convertTimestampToDate(messageTimeStamp);
    const messageTimeStampFormatted = this.utils.getHistoricalAgeFromTimestamp(standardizedTimeStamp);

    this.msgService.sendMessage(this.fromMatchProfile, this.toMatchProfile, this.message,
      messageTimeStamp)
      .map(res => res.json())
      .subscribe(response => {
        console.log(JSON.stringify(response));
        if (response['isSuccess']) {

          this.chatMessages.push({
            message: this.message,
            timestamp: messageTimeStampFormatted,
            incomingMessage: false
          });
          this.message = this.MESSAGE_PLACEHOLDER;
        } else {
          console.log('Error sending message');
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));

  }

  /*
  * Use this method later to determine whether to display message bubble on left or right side of chat window
  */
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
