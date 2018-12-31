import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVars, Utilities } from '../../providers';
import { MatchingResult } from '../../models/matching-result';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class Matches {
  authHeaders: any;

  constructor(public http: Http, public globalVars: GlobalVars,
    private utilService: Utilities) {
      utilService.getAuthHeadersFromStorage().then(val => {
        this.authHeaders = utilService.createHeadersObjFromAuth(val);
      });
    }

  getMatchesByMatchProfileId(matchProfileId) {
    const getMatchesUrl =
    `${ENV.BASE_URL}/matches?matchProfileId=${matchProfileId}`;
    console.log('Retrieving matches for matchProfile at ' + getMatchesUrl);
    return this.http.get(getMatchesUrl, { headers: this.authHeaders });
  }

  getNextBatch(matchProfileId: number) {
    const DEFAULT_RADIUS = 5;
    const fetchMatcherDataUrl =
    `${ENV.BASE_URL}/matcher?matchProfileId=${matchProfileId}&zipRadius=${DEFAULT_RADIUS}`;
    console.log('Retrieving next matcher batch', fetchMatcherDataUrl);

    // return this.http.get(fetchMatcherDataUrl, { headers: this.authHeaders });
  }

  submitBatchResults(matchProfileId: number, matchingResultData: MatchingResult[]) {
    const timestamp = new Date().toUTCString();
    const requestBody = JSON.stringify({
      matchProfileId: matchProfileId,
      matcherResults: matchingResultData,
      timestamp: timestamp
    });

    console.log('timestamp: ' + timestamp);
    const submitUrl = `${ENV.BASE_URL}/result/submit?matchProfileId=${matchProfileId}`;

    console.log(submitUrl);
    // return this.http.post(submitUrl, requestBody, { headers: this.authHeaders });
  }

}
