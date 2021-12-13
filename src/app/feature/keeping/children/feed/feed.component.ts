import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FeedService } from '@services/feed.service'
import { PublicService } from '@services/public.service'
import { TextService } from '@services/text.service'

import { Feed } from '@schemas/feed'
import { User } from '@schemas/user'

@Component({
    selector: 'feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
    variables: any
    user: User

    feedList: Array<Feed>

    constructor(
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
            this.getFeedList()
        } else {
            this.getPublicFeedList()
        }
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

    getPublicFeedList() {
        this.publicService.getFeedList().subscribe(
            (feedList: Feed[]) => {
                this.feedList = feedList
            },
            (e) => {}
        )
    }

    feedLike(feed: Feed) {
        if (this.storageService.getUser()) {
            if (feed.like) {
                this.feedService.deleteFeedLike(feed.id).subscribe(
                    (v) => {
                        feed.like = false
                        feed.like_count -= 1
                    },
                    (e) => {}
                )
            } else {
                this.feedService.createFeedLike(feed.id).subscribe(
                    (v) => {
                        feed.like = true
                        feed.like_count += 1
                    },
                    (e) => {}
                )
            }
        } else {
            this.router.navigateByUrl('/auth/login')
        }
    }

    goFeedDetail(feed: Feed) {
        this.router.navigateByUrl(`/feed/${feed.id}`)
    }
}
