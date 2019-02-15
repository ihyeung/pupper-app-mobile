import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { StorageUtilities } from '../../providers';
import { MatchingResult } from '../../models/matching-result';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class Matches {
  authHeaders: any;

  constructor(public http: Http, private utils: StorageUtilities) {
      this.utils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });
    }

  getMatchesByMatchProfileId(matchProfileId) {
    const getMatchesUrl =
    `${ENV.BASE_URL}/matches?matchProfileId=${matchProfileId}`;
    console.log('Retrieving matches for matchProfile at ' + getMatchesUrl);
    return this.http.get(getMatchesUrl, { headers: this.authHeaders });
  }

  getNextBatch(matchProfileId: number, randomize: boolean, calculateDistances: boolean) {
    const fetchMatcherDataUrl =
    `${ENV.BASE_URL}/matcher?matchProfileId=${matchProfileId}` +
    `&randomize=${randomize}&calculateDistances=${calculateDistances}`;
    console.log('Retrieving next matcher batch', fetchMatcherDataUrl);

    return this.http.get(fetchMatcherDataUrl, { headers: this.authHeaders });
  }

  submitBatchResults(matchProfileId: number, matchingResultData: MatchingResult[]) {
    const timestamp = new Date().toUTCString();
    const requestBody = JSON.stringify({
      matchProfileId: matchProfileId,
      matcherResults: matchingResultData,
      timestamp: timestamp
    });

    const submitUrl = `${ENV.BASE_URL}/result/submit?matchProfileId=${matchProfileId}`;

    console.log(submitUrl);
    return this.http.post(submitUrl, requestBody, { headers: this.authHeaders });
  }

  updateMatchResult(matchProfileId: number, resultForMatchProfileId: number, result: boolean) {
    const url = `${ENV.BASE_URL}/matcher/result?matchProfileId=${matchProfileId}` +
    `&resultFor=${resultForMatchProfileId}&isMatch=${result}`;
    console.log(url);

    return this.http.post(url, {}, { headers: this.authHeaders });
  }

  deleteMatchResultsForMatchProfile(matchProfileId: number) {
    const url = `${ENV.BASE_URL}/matcher/result?matchProfileId=${matchProfileId}`;
    console.log(url);

    return this.http.delete(url, { headers: this.authHeaders });
  }

}
