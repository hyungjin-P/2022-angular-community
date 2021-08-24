import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

import { StorageService } from '@services/storage.service'

import { ChatService } from '@services/chat.service'

@Component({
    selector: 'websocket',
    templateUrl: './websocket.component.html',
    styleUrls: ['./websocket.component.scss'],
})
export class WebSocketComponent implements OnInit {
    user
    subscription: Subscription

    constructor(private storageService: StorageService, private chatService: ChatService) {}

    ngOnInit() {}

    connect() {
        console.log('connect')
        this.user = {
            id: '5f5cae86-c1c0-11ea-b8db-0ac5bb0044e6',
        }
        this.chatService.connect(this.user)
    }

    disconnect() {
        console.log('disconnect')
        this.chatService.disconnect()
    }

    publish() {
        console.log('publish')
        this.chatService.setMember('112')
    }

    subscribe() {
        console.log('subscribe')
        this.subscription = this.chatService.getMemberList('112').subscribe(
            (v) => {
                console.log(v)
            },
            (error) => {
                console.log(error)
            }
        )
    }
    unsubscribe() {
        console.log('unsubscribe')
        this.subscription.unsubscribe()
    }
}
