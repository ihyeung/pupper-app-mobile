export class MatchPreference {

  id: number;
  matchProfile: any;
  preferenceType: string;
  preference: string;

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface MatchPreference {
  [prop: string]: any;
}
