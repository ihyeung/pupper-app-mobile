export class MatchingResult {

  id: number;
  isMatch: boolean;

  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface MatchingResult {
  [prop: string]: any;
}
