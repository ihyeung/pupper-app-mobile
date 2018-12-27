export class ProfileCard {
  constructor(
    public profileId: number,
    public name: string,
    public ageWithUnits: string,
    public sex: string,
    public breedName: string,
    public distance: string,
    public aboutMe: string,
    public lastActive: string,
    public profileImage: string,
    public energyLevel: string,
    public numDogs: number
  ) { }
}
