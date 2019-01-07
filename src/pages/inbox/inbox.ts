import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Utilities, Messages, Matches  } from '../../providers';
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


  constructor(public navCtrl: NavController,
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
            id: match['id'],
            profileImage: match['profileImage'] ? match['profileImage'] : DEFAULT_IMG,
            names: match['names'],
            breed: match['breed'],
            lifeStage: match['lifeStage'],
            energyLevel: match['energyLevel'],
            aboutMe: match['aboutMe'],
            birthdate: match['birthdate'],
            sex: match['sex'],
            userProfile: match['userProfile']
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

          const previewTimestamp = this.utilService.getMessageAgeFromTimestamp(history[0]['timestamp']);

          this.inboxMessagePreviews.push({
            matchProfileObj: otherMatchProfile,
            matchProfileName: otherMatchProfile['names'],
            image: otherMatchProfile['profileImage'] ? otherMatchProfile['profileImage'] : DEFAULT_IMG,
            message: history[0]['message'],
            timestamp: previewTimestamp
          });
          this.inboxMessageRecentHistory.push(history.reverse());
        }
      });
      this.messagesReady = true;
    }, err => console.error('ERROR', err));
  }

  viewMatchProfile(matchProfile: any) {
    console.log('clicked on match profile for matchProfileId=' + matchProfile['id']);
    this.navCtrl.push('MatchProfileDetailPage', {
      matchProfile: matchProfile,
      readOnly: true
    });
  }

  viewMessageHistory(inboxPreviewItem) {
    const matchProfile = inboxPreviewItem['matchProfileObj'];
    console.log('clicked to view message history for current user & matchProfileId=' + matchProfile['id']);

    const listIndex = this.inboxMessagePreviews.indexOf(inboxPreviewItem);

    this.navCtrl.push('ChatPage', {
      matchProfileReceiver: matchProfile,
      messages: this.inboxMessageRecentHistory[listIndex]
    });
  }

}
