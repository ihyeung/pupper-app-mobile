export class MatchingResult {

  id: number;
  isMatch: boolean;

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface MatchingResult {
  [prop: string]: any;
}
