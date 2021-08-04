export class User {
    constructor(
        public id: string,
        public provider: string,
        public name: string,
        public picture: string,
        public sex: string,
        public birth_date: string,
        public email: string,
        public email_verified: number,
        public phone_number: string,
        public phone_number_verified: number,
        public color: string,
        public access_token: string,
        public refresh_token: string,
        public custom_token: string,
        public sign_in_method?: string
    ) {
        this.id = id
        this.provider = provider
        this.name = name
        this.picture = picture
        this.sex = sex
        this.birth_date = birth_date
        this.email = email
        this.email_verified = email_verified
        this.phone_number = phone_number
        this.phone_number_verified = phone_number_verified
        this.color = color
        this.access_token = access_token
        this.refresh_token = refresh_token
        this.custom_token = custom_token
        this.sign_in_method = sign_in_method
    }
}
