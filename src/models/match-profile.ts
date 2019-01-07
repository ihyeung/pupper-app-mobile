export class MatchProfile {

  id: number;
  names: string;
  breed: any;
  birthdate: string;
  aboutMe: string;
  profileImage: string;
  numDogs: number;
  lifeStage: string;
  energyLevel: string;
  userProfile: any;
  sex: string;
  size: string;
  zipRadius: number;

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
