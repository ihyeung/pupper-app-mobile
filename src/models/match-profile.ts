export class MatchProfile {

  id: number;
  names: string;
  breed: string;
  birthdate: string;
  aboutMe: string;
  profileImage: string;
  numDogs: number;
  lifeStage: string;
  energyLevel: string;
  userProfile: any;

  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface MatchProfile {
  [prop: string]: any;
}
