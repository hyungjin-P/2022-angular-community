import { File } from './file';

export class User {
  constructor(
    public id: string,
    public provider: string,
    public name: string,
    public nickname: string,
    public age: number,
    public sex: string,
    public birthDate: string,
    public email: string,
    public emailVerified: boolean,
    public phoneNumber: string,
    public phoneNumberVerified: boolean,
    public color: string,
    public aboutMe: string,
    public agreementAge: boolean,
    public agreementPrivacy: boolean,
    public agreementServiceTerms: boolean,
    public agreementMarketing: boolean,
    public picture: Array<File>,
    public background: Array<File>,
    public accessToken: string,
    public refreshToken: string,
    public customToken: string,
    public isFollow: boolean
  ) {
    this.id = id;
    this.provider = provider;
    this.name = name;
    this.nickname = nickname;
    this.age = age;
    this.sex = sex;
    this.birthDate = birthDate;
    this.email = email;
    this.emailVerified = emailVerified;
    this.phoneNumber = phoneNumber;
    this.phoneNumberVerified = phoneNumberVerified;
    this.color = color;
    this.aboutMe = aboutMe;
    this.agreementAge = agreementAge;
    this.agreementPrivacy = agreementPrivacy;
    this.agreementServiceTerms = agreementServiceTerms;
    this.agreementMarketing = agreementMarketing;
    this.picture = picture;
    this.background = background;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.customToken = customToken;
    this.isFollow = isFollow;
  }
}
