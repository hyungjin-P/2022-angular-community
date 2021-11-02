export class User {
    constructor(
        public id: string,
        public provider: string,
        public name: string,
        public picture: string,
        public age: number,
        public sex: string,
        public birth_date: string,
        public email: string,
        public email_verified: boolean,
        public phone_number: string,
        public phone_number_verified: boolean,
        public color: string,
        public agreement_age: boolean,
        public agreement_privacy: boolean,
        public agreement_service_terms: boolean,
        public agreement_marketing: boolean,
        public access_token: string,
        public refresh_token: string,
        public custom_token: string
    ) {
        this.id = id
        this.provider = provider
        this.name = name
        this.picture = picture
        this.age = age
        this.sex = sex
        this.birth_date = birth_date
        this.email = email
        this.email_verified = email_verified
        this.phone_number = phone_number
        this.phone_number_verified = phone_number_verified
        this.color = color
        this.agreement_age = agreement_age
        this.agreement_privacy = agreement_privacy
        this.agreement_service_terms = agreement_service_terms
        this.agreement_marketing = agreement_marketing
        this.access_token = access_token
        this.refresh_token = refresh_token
        this.custom_token = custom_token
    }
}
