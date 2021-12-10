import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FeedService } from '@services/feed.service'
import { TextService } from '@services/text.service'

import { Feed } from '@schemas/feed'
import { FeedTag } from '@schemas/feed-tag'
import { User } from '@schemas/user'

@Component({
    selector: 'feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
    user: User

    feedList: Array<Feed>

    constructor(
        private globalService: GlobalService,
        private storageService: StorageService,
        private feedService: FeedService,
        private textService: TextService
    ) {}

    ngOnInit() {
        this.user = this.storageService.getUser()

        this.getFeedList()
    }

    getFeedList() {
        this.feedService.getFeedList().subscribe(
            (feedList: Feed[]) => {
                this.feedList = feedList
                console.log(this.feedList)
            },
            (e) => {}
        )
    }
}
