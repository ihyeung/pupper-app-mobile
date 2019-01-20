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
  isDefault: boolean;

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface MatchProfile {
  [prop: string]: any;
}
