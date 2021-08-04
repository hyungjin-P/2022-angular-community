import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { User } from '@schemas/user'
import { WebSocketService } from '@services/websocket.service'

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private webSocketService: WebSocketService) {}

    connect(user: User) {
        this.webSocketService.connect(user)
    }

    disconnect() {
        this.webSocketService.disconnect()
    }

    getMemberList(gymId: string): Observable<any> {
        return this.webSocketService.getChannel('member', { gymId: gymId })
    }

    setMember(gymId: string) {
        this.webSocketService.publish('member', 'create', { gymId: gymId })
    }
}
