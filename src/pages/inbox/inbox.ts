import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Utilities, Messages, Matches, GlobalVars } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})
export class MessageInboxPage {

  inboxSelector: string = 'matches';
  matchProfileId: number;
  inboxMessagePreviews: any = []; //The latest PupperMessage exchanged between user and all of their matches
  inboxMessageRecentHistory: any = []; //The 5 most recent PupperMessages exchanged between user and all of their matches
  matchesList: any = [];
  messagesReady: boolean = false;
  matchesReady: boolean = false;


  constructor(public navCtrl: NavController, public globalVars: GlobalVars,
    public matchService: Matches, public msgService: Messages,
    public utilService: Utilities) {

    }

    ionViewDidLoad() {
      this.utilService.getDataFromStorage('match').then(val => {
        this.matchProfileId = val['id'];

        this.retrieveMatches(); //Default view to show contents of matches tab
      });
    }

    retrieveMatches() {
      if (this.matchesReady) { //Only load once
        return;
      }
      this.matchService.getMatchesByMatchProfileId(this.matchProfileId)
      .subscribe(response => {
        const matchProfileList = JSON.parse(response['_body']);
        matchProfileList.forEach(match => {
          this.matchesList.push({
            matchProfileId: match['id'],
            image: match['profileImage'] == null ? 'assets/img/appLogo.png' : match['profileImage'],
            matchProfileName: match['names'],
            breed: match['breed']['name'],
            about: match['aboutMe']
          });
        });
        this.matchesReady = true;
        console.log('Matches are now ready');
      }, err => console.error('ERROR', err));

    }

    retrieveMessageHistoriesWithMatches() {
      if (this.messagesReady) {
        return;
      }
      this.msgService.retrieveMessagesForInbox(this.matchProfileId)
      .subscribe(response => {
        const messageHistoryList = JSON.parse(response['_body']);
        messageHistoryList.forEach(history => {
          if (history === undefined || history.length == 0) {
            // console.log('No messages exchanged between these users yet');
          } else {
            let otherMatchProfile = history[0]['matchProfileSender'];
            let incomingMessage = true;
            if ( otherMatchProfile['id'] == this.matchProfileId) { //Make sure to add the other user's id and name to message array
            otherMatchProfile = history[0]['matchProfileReceiver'];
            incomingMessage = false;
          }

          this.inboxMessageRecentHistory.push(history);
          this.inboxMessagePreviews.push({
            matchProfileObj: otherMatchProfile,
            matchProfileName: otherMatchProfile['names'],
            image: otherMatchProfile['profileImage'] ? otherMatchProfile['profileImage'] : 'assets/img/appLogo.png',
            message: history[0]['message'],
            timestamp: history[0]['timestamp'],
            incomingMessage: incomingMessage
          });
        }
      });
      this.messagesReady = true;
    }, err => console.error('ERROR', err));
  }

  viewMatchProfile(matchListEntry) {
    const matchProfileId = matchListEntry['matchProfileObj']['id'];
    console.log('clicked on match profile for matchProfileId=' + matchProfileId);
    this.navCtrl.push('MatchProfileDetailPage', {
      matchProfileId: matchProfileId
    });
  }

  viewMessageHistory(inboxPreviewItem) {
    const matchProfile = inboxPreviewItem['matchProfileObj'];
    console.log('viewMessageHistory matchProfileObj: ' + matchProfile);
    const matchProfileId = matchProfile['id'];
    console.log('clicked to view message history for current user & matchProfileId=' + matchProfileId);

    const listIndex = this.inboxMessagePreviews.indexOf(inboxPreviewItem);

    console.log('Retrieving message history for inboxMessagePreviews array element ' + listIndex);

    this.navCtrl.push('ChatPage', {
      matchProfileReceiver: matchProfile,
      messages: this.inboxMessageRecentHistory[listIndex]
    });
  }

}
