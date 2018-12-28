import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { MatchesProvider } from '../../providers/http/matches';
import { MessagesProvider } from '../../providers/http/messages';
import { CreateMatchProfilePage } from '../createMatchProfile/createMatchProfile';
import { UtilityProvider } from '../../providers/utility/utilities';

@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})
export class MessageInboxPage {

  matchProfileId: number;
  inboxMessagePreviews = [];
  matchesList = [];
  messagesReady: boolean = false;
  matchesReady: boolean = false;


  constructor(public navCtrl: NavController, public globalVars: GlobalVarsProvider,
    public matchService: MatchesProvider, public msgService: MessagesProvider,
    public utilService: UtilityProvider) {
      if (null == this.globalVars.getMatchProfileObj()) {
        console.log('Please create a matching profile to begin matching.');
        this.navCtrl.push(CreateMatchProfilePage);
      }
      this.matchProfileId = this.globalVars.getMatchProfileObj()['id'];
      this.retrieveMatches(); //Default to show contents of matches tab
    }

    retrieveMatches() {
      if (this.matchesReady) {
        return;
      }
      this.matchService.getMatchesByMatchProfileId(this.matchProfileId)
      .subscribe(response => {
        const matchProfileList = JSON.parse(response['_body']);
        matchProfileList.forEach(match => {
          this.matchesList.push({
            matchProfileId: match['id'],
            image: match['profileImage'] == null ? 'assets/imgs/appLogo.png' : match['profileImage'],
            matchProfileName: match['names'],
            breed: match['breed']['name'],
            about: match['aboutMe']
          });
        });
        this.matchesReady = true;
      }, err => console.log(err)
    );
  }

  retrieveMessageHistoriesWithMatches() {
    if (this.messagesReady) {
      return;
    }
    this.msgService.retrieveMessagesForInbox(this.matchProfileId)
    .subscribe(response => {
      // console.log('Response body: ' + response['_body']);
      const messageHistoryList = JSON.parse(response['_body']);
      messageHistoryList.forEach(history => {
        if (history === undefined || history.length == 0) {
          console.log('No messages exchanged between these users yet');
        } else {
          let otherMatchProfileId = history[0]['matchProfileSender']['id'];
          let otherMatchProfileName = history[0]['matchProfileSender']['names'];
          let otherMatchProfileImage = history[0]['matchProfileSender']['profileImage'];

          if ( otherMatchProfileId == this.matchProfileId) { //Make sure to add the other user's id and name to message array
          otherMatchProfileId = history[0]['matchProfileReceiver']['id'];
          otherMatchProfileName = history[0]['matchProfileReceiver']['names'];
          otherMatchProfileImage = history[0]['matchProfileReceiver']['profileImage'];
        }
        this.inboxMessagePreviews.push({
          matchProfileId: otherMatchProfileId,
          matchProfileName: otherMatchProfileName,
          image: otherMatchProfileImage == null ? 'assets/imgs/appLogo.png' : otherMatchProfileImage,
          message: history[0]['message'],
          timestamp: history[0]['timestamp']
        });
      }
    });
    this.messagesReady = true;
  }, err => console.log(err)
);
}

viewMatchProfile(matchListEntry) {
  const matchProfileId = matchListEntry['matchProfileId'];
  console.log('clicked on match profile for matchProfileId=' + matchProfileId);
}

viewMessageHistory(inboxMessage) {
  const matchProfileId = inboxMessage['matchProfileId'];
  console.log('clicked to view message history for current user & matchProfileId=' + matchProfileId);
}

}
