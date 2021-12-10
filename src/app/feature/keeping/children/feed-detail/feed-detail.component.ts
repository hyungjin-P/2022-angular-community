import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FeedService } from '@services/feed.service'
import { PublicService } from '@services/public.service'
import { TextService } from '@services/text.service'

import { Feed } from '@schemas/feed'
import { FeedTag } from '@schemas/feed-tag'
import { User } from '@schemas/user'

@Component({
    selector: 'feed-detail',
    templateUrl: './feed-detail.component.html',
    styleUrls: ['./feed-detail.component.scss'],
})
export class FeedDetailComponent implements OnInit {
    variables: any
    user: User

    selectedFeed: Feed
    feedList: Array<Feed>

    constructor(
        private location: Location,
        private router: Router,
        private globalService: GlobalService,
        private storageService: StorageService,
        private feedService: FeedService,
        private publicService: PublicService,
        private textService: TextService
    ) {}

    ngOnInit() {
        this.variables = this.globalService.variables
        this.user = this.storageService.getUser()

        if (this.user) {
            this.getFeed()
            this.getFeedList()
        } else {
            this.getPublicFeed()
            this.getPublicFeedList()
        }
    }

    goBack() {
        this.location.back()
    }

    getFeed() {}

    getPublicFeed() {}

    getFeedList() {
        this.feedService.getFeedList().subscribe(
            (feedList: Feed[]) => {
                this.feedList = feedList
                console.log('login', this.feedList)
            },
            (e) => {}
        )
    }

    getPublicFeedList() {
        this.publicService.getFeedList().subscribe(
            (feedList: Feed[]) => {
                this.feedList = feedList
                console.log('public', this.feedList)
            },
            (e) => {}
        )
    }
}
