import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Utilities, Messages, Matches, GlobalVars } from '../../providers';
import { DEFAULT_IMG } from '../';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})
export class MessageInboxPage {

  inboxSelector: string = 'matches'; //Default view to show contents of matches tab
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

        this.retrieveMatches();
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
          console.log(match);
          this.matchesList.push({
            matchProfileId: match['id'],
            image: match['profileImage'] ? match['profileImage'] : DEFAULT_IMG,
            matchProfileName: match['names'],
            breed: match['breed']['name'],
            lifeStage: match['lifeStage'],
            energyLevel: match['energyLevel'],
            about: match['aboutMe']
          });
        });
        this.matchesReady = true;
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
            if ( otherMatchProfile['id'] == this.matchProfileId) { //Make sure to add the other user's id and name to message array
            otherMatchProfile = history[0]['matchProfileReceiver'];
          }

          this.inboxMessageRecentHistory.push(history);
          this.inboxMessagePreviews.push({
            matchProfileObj: otherMatchProfile,
            matchProfileName: otherMatchProfile['names'],
            image: otherMatchProfile['profileImage'] ? otherMatchProfile['profileImage'] : DEFAULT_IMG,
            message: history[0]['message'],
            timestamp: history[0]['timestamp']
          });
        }
      });
      this.messagesReady = true;
    }, err => console.error('ERROR', err));
  }

  viewMatchProfile(matchProfileId) {
    console.log('clicked on match profile for matchProfileId=' + matchProfileId);
    this.navCtrl.push('MatchProfileDetailPage', {
      matchProfileId: matchProfileId
    });
  }

  viewMessageHistory(inboxPreviewItem) {
    const matchProfile = inboxPreviewItem['matchProfileObj'];
    const matchProfileId = matchProfile['id'];
    console.log('clicked to view message history for current user & matchProfileId=' + matchProfileId);

    const listIndex = this.inboxMessagePreviews.indexOf(inboxPreviewItem);

    this.navCtrl.push('ChatPage', {
      matchProfileReceiver: matchProfile,
      messages: this.inboxMessageRecentHistory[listIndex]
    });
  }

}
