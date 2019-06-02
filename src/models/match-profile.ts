export class MatchProfile {

  id: number;
  names: string;
  numDogs: number;
  sex: string;
  birthdate: string;
  breed: any;
  size: string;
  energyLevel: string;
  lifeStage: string;
  score: number;
  aboutMe: string;
  profileImage: string;
  userProfile: any;
  zipRadius: number;
  isDefault: boolean;
  showSimilar: boolean; //TODO: implement this functionality
  isHidden: boolean; //TODO: implement this functionality

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface MatchProfile {
  [prop: string]: any;
}
