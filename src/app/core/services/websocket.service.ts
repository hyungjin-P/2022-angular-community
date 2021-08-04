import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'

import { User } from '@schemas/user'
import { Message } from '@schemas/message'
import { environment } from '@environments/environment'

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private webSocketSubject$: WebSocketSubject<any>
    user: User

    constructor() {}

    private createWebSocket(): WebSocketSubject<any> {
        return webSocket({
            url: environment['wss'],
            openObserver: {
                next: () => {
                    console.log('Socket Open')
                    const initMsg = this.getMessage('init', null, null, {})
                    this.send(initMsg)
                },
            },
            closeObserver: {
                next: () => {
                    console.log('Socket Closed')
                    this.webSocketSubject$ = null
                },
            },
            deserializer: (e) => JSON.parse(e.data),
            serializer: (v) => JSON.stringify(v),
        })
    }

    connect(user: User) {
        if (!this.webSocketSubject$) {
            this.webSocketSubject$ = this.createWebSocket()
            this.webSocketSubject$.subscribe()
            this.user = user
        }
    }

    disconnect() {
        if (this.webSocketSubject$) {
            this.webSocketSubject$.unsubscribe()
            this.user = null
        }
    }

    private getMessage(type: string, subject: string, method: string, data: any): Message {
        return new Message(type, subject, method, { ...data, userId: this.user.id })
    }

    private send(message: Message) {
        this.webSocketSubject$.next(message)
    }

    getChannel(subject: string, data: any): Observable<any> {
        const subMsg: Message = this.getMessage('subscribe', subject, null, data)
        const unsubMsg: Message = this.getMessage('unsubscribe', subject, null, data)

        return this.webSocketSubject$.multiplex(
            () => subMsg,
            () => unsubMsg,
            (message) => message.subject === subject
        )
    }

    publish(subject: string, method: string, data: any) {
        const pubMsg: Message = this.getMessage('publish', subject, method, data)
        this.send(pubMsg)
    }
}
