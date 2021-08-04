export class Message {
    action: string

    constructor(
        public type: string, // publish, subscribe, unsubscribe
        public subject: string,
        public method: string, // create, update, delete
        public data: any
    ) {
        this.action = 'message'
    }
}
