import { Component, OnDestroy, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'

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
export class FeedDetailComponent implements OnInit, OnDestroy {
    variables: any
    user: User

    selectedFeedId: string
    selectedFeed: Feed
    feedList: Array<Feed>

    subscription: Subscription

    constructor(
        private location: Location,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private globalService: GlobalService,
        private storageService: StorageService,
        private feedService: FeedService,
        private publicService: PublicService,
        private textService: TextService
    ) {}

    ngOnInit() {
        this.variables = this.globalService.variables
        this.user = this.storageService.getUser()

        this.subscription = this.activatedRoute.params.subscribe(
            (v) => {
                this.selectedFeedId = v['feed_id']
                this.init()
            },
            (e) => {}
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }

    init() {
        if (this.user) {
            this.getFeed()
            this.getFeedList()
        } else {
            this.getPublicFeed()
            this.getPublicFeedList()
        }
    }

    goBack() {
        this.router.navigateByUrl('/feed')
    }

    getFeed() {
        this.feedService.getFeed(this.selectedFeedId).subscribe(
            (feed: Feed) => {
                this.selectedFeed = feed
                console.log('feed_login', this.selectedFeed)
            },
            (e) => {}
        )
    }

    getPublicFeed() {
        this.publicService.getFeed(this.selectedFeedId).subscribe(
            (feed: Feed) => {
                this.selectedFeed = feed
                console.log('feed_public', this.selectedFeed)
            },
            (e) => {}
        )
    }

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

    feedLike(feed: Feed) {
        if (this.storageService.getUser()) {
            if (feed.like) {
                this.feedService.deleteFeedLike(feed.id).subscribe(
                    (v) => {
                        feed.like = false
                        feed.like_count -= 1

                        this.selectedFeed.like_users.forEach((user, index) => {
                            if (user.id == this.user.id) {
                                this.selectedFeed.like_users.splice(index, 1)
                            }
                        })
                    },
                    (e) => {}
                )
            } else {
                this.feedService.createFeedLike(feed.id).subscribe(
                    (v) => {
                        feed.like = true
                        feed.like_count += 1

                        this.selectedFeed.like_users.push(this.user)
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
