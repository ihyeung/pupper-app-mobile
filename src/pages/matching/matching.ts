import { Component, EventEmitter } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MatchingResult } from '../../models/matching-result';
import { MatchProfiles, Utilities, StorageUtilities, Matches } from '../../providers';
import { environment as ENV } from '../../environments/environment';
import { DEFAULT_IMG, MATCH_PROFILE_ERROR } from '../../pages';


export interface Card {
  profileId: number;
  name: string;
  breedName: string;
  sex: string;
  energyLevel: string;
  lifeStage: string;
  lastActive: string;
  ageWithUnits: string;
  aboutMe: string;
  profileImage: string;
  distance: string;
  numDogs: number;
  isMatch: boolean;
  userId: number;
}

@IonicPage()
@Component({
  selector: 'page-matching',
  templateUrl: 'matching.html'
})
export class MatchingPage {

  matchProfileObj: any = [];
  matchingResults: MatchingResult[];
  nextBatchReady: boolean = false;
  deckOfCards = [];
  cardDirection = "xy";
  cardOverlay: any = {
    like: {
      backgroundColor: '#28e93b'
    },
    dislike: {
      backgroundColor: '#e92828'
    }
  };

  constructor(private sanitizer: DomSanitizer, public alertCtrl: AlertController,
    public navCtrl: NavController, public matchProfService: MatchProfiles,
    public utils: Utilities, public storageUtils: StorageUtilities,
    public matchesService: Matches) { }

    ionViewDidLoad() {
      console.log('ionViewDidLoad MatchProfilePage');
      this.matchingResults = new Array<MatchingResult>();
      this.storageUtils.getDataFromStorage('match').then(val => {
        if (!val) {
          console.log('No default match profile was found in storage');
          let alert = this.utils.presentAlert(MATCH_PROFILE_ERROR);
          alert.present();
          alert.onDidDismiss(() => {
            this.navCtrl.push('CreateMatchProfilePage');

          });

        } else {
          this.matchProfileObj = val;
          this.retrieveNextProfileBatch();
        }
      });
    }

    retrieveNextProfileBatch() {
      const matchProfileId = this.matchProfileObj['id'];

      this.matchesService.getNextBatch(matchProfileId, ENV.RANDOMIZE_MATCHING, ENV.RETRIEVE_WITH_ZIP_DATA)
      .map(res => res.json())
      .subscribe(resp => {
        console.log(JSON.stringify(resp));
        if (resp.length == 0) {
          this.matchingErrorModal();
        } else {
          this.addToDeck(resp);
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }


    addToDeck(nextBatch: any) {
      nextBatch.forEach(profile => {
        console.log(profile);
        let imageStr = this.utils.validateImageUri(profile['profileImage'], DEFAULT_IMG);

        this.deckOfCards.push({
          id: profile['profileId'],
          name:profile['name'],
          likeEvent: new EventEmitter(),
          destroyEvent: new EventEmitter(),
          imageUrl: this.sanitizer.bypassSecurityTrustStyle('url(' + imageStr + ')'),
          info: profile['aboutMe'],
          sex: profile['sex'],
          isMatch: profile['match'],
          userId: profile['userId'],
          location: profile['distance'],
          age: profile['ageWithUnits'],
          lastActive: profile['lastActive']
        });
      });

      this.nextBatchReady = true;
    }

    onProfileMatchResult(event, profile) {

      const listIndex = this.deckOfCards.indexOf(profile);
      const cardsRemaining = this.deckOfCards.length - 1 - listIndex;
      console.log('Cards remaining: ', cardsRemaining);
      if (cardsRemaining == 1) {
        this.retrieveNextProfileBatch();
      }
      console.log('profile card #' + listIndex + ' of stack has been liked/disliked by user');

      if (event.like) {
        console.log("LIKE");
        this.matchingResults.push(new MatchingResult({id: profile['id'], isMatch: true}));
        if (profile['isMatch']) {
          console.log('active user was previously liked by this profile, mutual match');
          this.onMutualMatch(profile['id']);
        }
      } else {
        console.log("NOT A LIKE");
        this.matchingResults.push(new MatchingResult({id: profile['id'], isMatch: false}));

      }
      if (this.matchingResults.length >= 5) {
        this.submitMatchingResults();
      }
    }

    submitMatchingResults() {
      console.log(`${this.matchingResults.length} match result records to submit for update`);
      console.log("Not implemented yet");
      // this.matchingResults = new Array<MatchingResult>();
    }

    viewProfile(id: number) {
      console.log('Viewing Match Profile ' + id);
      this.navCtrl.push('MatchProfileDetailPage', {
        matchProfileId: id,
        readOnly: true
      });
    }

    private matchingErrorModal() {
      console.log('No more profiles left');
      this.deckOfCards.push({
        message: "There are no more match profiles to display. Try expanding your zip code radius"
      });
    }

    onMutualMatch(profileId: number) {
      let matchDialog = this.alertCtrl.create({
        title: 'It\'s a match!',
        message: 'Would you like to send this pup a message?',
        buttons: [
          {
            text: 'Keep Matching',
            handler: () => {
              console.log('Continue Clicked');
            }
          },
          {
            text: 'Send A Message',
            handler: () => {
              console.log('Lets Chat Clicked');
              this.matchProfService.getMatchProfileByMatchProfileId(profileId)
              .map(res => res.json())
              .subscribe(resp => {
                if (resp['matchProfiles']) {
                  this.navCtrl.push('ChatPage', {
                    newMatch: true,
                    matchProfileReceiver: resp['matchProfiles'][0]
                  });
                }

              }, err => console.error('ERROR: ', JSON.stringify(err)));
            }
          }
        ]
      });
      matchDialog.present();
    }
  }
