import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import {
    animationFrameScheduler,
    defer,
    fromEvent,
    Observable,
    interval,
    concat,
    of,
    scheduled,
    queueScheduler,
    asapScheduler,
    asyncScheduler,
    Subscription,
} from 'rxjs'
import {
    map,
    switchMap,
    takeUntil,
    take,
    startWith,
    tap,
    withLatestFrom,
    share,
    scan,
    takeWhile,
    mergeAll,
} from 'rxjs/operators'
import * as moment from 'moment-timezone'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FeedService } from '@services/feed.service'
import { PublicService } from '@services/public.service'
import { TextService } from '@services/text.service'

import { Feed } from '@schemas/feed'
import { FeedComment } from '@schemas/feed-comment'
import { User } from '@schemas/user'

@Component({
    selector: 'feed-detail',
    templateUrl: './feed-detail.component.html',
    styleUrls: ['./feed-detail.component.scss'],
})
export class FeedDetailComponent implements OnInit, AfterViewInit, OnDestroy {
    variables: any
    user: User

    selectedFeedId: string
    selectedFeed: Feed
    feedList: Array<Feed>

    subscription: Subscription

    @ViewChild('carousel')
    carousel

    @ViewChild('container')
    container

    size$

    start$
    move$
    end$

    drag$
    drop$

    updateStore
    carousel$
    tobeIndex: number
    refresh: boolean

    moreBoxVisible: boolean

    selectedLanguage: string
    commentViewVisible: boolean
    feedCommentInput: string
    feedCommentList: Array<FeedComment>
    feedSubCommentInputViewObj: any
    feedSubCommentInputValueObj: any
    feedSubCommentListViewObj: any
    feedSubCommentListObj: any
    likedViewVisible: boolean

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

        this.tobeIndex = 0

        this.subscription = this.activatedRoute.params.subscribe(
            (v) => {
                this.selectedFeedId = v['feed_id']
                this.init()
            },
            (e) => {}
        )

        this.selectedLanguage = localStorage.getItem('language')
        this.commentViewVisible = false
        this.feedCommentInput = ''
        this.feedCommentList = []
        this.feedSubCommentInputViewObj = {}
        this.feedSubCommentInputValueObj = {}
        this.feedSubCommentListViewObj = {}
        this.feedSubCommentListObj = {}
        this.likedViewVisible = false
    }

    ngAfterViewInit() {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        const EVENTS = {
            start: SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
            move: SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
            end: SUPPORT_TOUCH ? 'touchend' : 'mouseup',
        }
        const DEFAULT_DURATION = 300

        this.size$ = fromEvent(window, 'resize').pipe(
            startWith(0),
            map((event: any) => this.carousel.nativeElement.clientWidth)
        )

        this.start$ = fromEvent(this.carousel.nativeElement, EVENTS.start).pipe(this.toPos)
        this.move$ = fromEvent(this.carousel.nativeElement, EVENTS.move).pipe(this.toPos)
        this.end$ = fromEvent(this.carousel.nativeElement, EVENTS.end)

        this.drag$ = this.start$.pipe(
            switchMap((start: any) =>
                this.move$.pipe(
                    map((move: number) => move - start),
                    takeUntil(this.end$)
                )
            ),
            share(),
            map((distance) => ({
                distance,
            }))
        )

        this.drop$ = this.drag$.pipe(
            switchMap((drag) =>
                this.end$.pipe(
                    map((event) => drag),
                    take(1)
                )
            ),
            withLatestFrom(this.size$, (drag: any, size) => {
                return { ...drag, size }
            })
        )

        this.carousel$ = scheduled([this.drag$, this.drop$], asapScheduler).pipe(
            mergeAll(),
            scan(
                (store, { distance, size }) => {
                    const updateStore: any = {
                        from: -(store.index * store.size) + distance,
                    }

                    if (size == undefined) {
                        updateStore.to = updateStore.from
                    } else {
                        const THRESHOLD = 30
                        const PANEL_COUNT = 1
                        this.tobeIndex = store.index
                        if (Math.abs(distance) >= THRESHOLD) {
                            this.tobeIndex =
                                distance >= 0
                                    ? Math.max(this.tobeIndex - 1, 0)
                                    : Math.min(this.tobeIndex + 1, this.selectedFeed.pictures.length - 1)
                        }
                        updateStore.index = this.tobeIndex
                        updateStore.to = -(this.tobeIndex * size)
                        updateStore.size = size
                    }

                    if (this.refresh) {
                        this.refresh = false

                        return {
                            from: 0,
                            to: 0,
                            index: 0,
                            size: 0,
                        }
                    } else {
                        return {
                            ...store,
                            ...updateStore,
                        }
                    }
                },
                {
                    from: 0,
                    to: 0,
                    index: 0,
                    size: 0,
                }
            ),
            switchMap(({ from, to }) => (from == to ? of(to) : this.animation(from, to, DEFAULT_DURATION)))
        )

        this.carousel$.subscribe((pos) => {
            this.translateX(pos)
        })
    }

    toPos(obs$) {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)))
    }

    translateX(posX) {
        this.container.nativeElement.style.transform = `translate3d(${posX}px, 0, 0)`
    }

    animation(from, to, duration) {
        return defer(() => {
            const scheduler = animationFrameScheduler
            const start = scheduler.now()
            const interval$ = interval(0, scheduler).pipe(
                map(() => (scheduler.now() - start) / duration),
                takeWhile((rate) => rate < 1)
            )

            return concat(interval$, of(1)).pipe(map((rate) => from + (to - from) * rate))
        })
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

                if (!this.selectedFeed) {
                    this.router.navigateByUrl('/feed')
                }
            },
            (e) => {
                this.router.navigateByUrl('/feed')
            }
        )
    }

    getPublicFeed() {
        this.publicService.getFeed(this.selectedFeedId).subscribe(
            (feed: Feed) => {
                this.selectedFeed = feed
            },
            (e) => {}
        )
    }

    getFeedList() {
        this.feedService.getFeedList().subscribe(
            (feedList: Feed[]) => {
                this.feedList = feedList
            },
            (e) => {}
        )
    }

    getFeedCommentList() {
        this.feedService.getFeedCommentList(this.selectedFeed.id).subscribe(
            (feedCommentList: Array<FeedComment>) => {
                console.log('feedCommentList', feedCommentList)
                this.feedCommentList = feedCommentList
            },
            (e) => {}
        )
    }

    getFeedSubCommentList(feedCommentId: string) {
        this.feedService.getFeedSubCommentList(this.selectedFeed.id, feedCommentId).subscribe(
            (feedCommentList: Array<FeedComment>) => {
                console.log('feedSubCommentList', feedCommentList)
                this.feedSubCommentListObj[feedCommentId] = feedCommentList
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

    selectedFeedLike(feed: Feed) {
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
        this.tobeIndex = 0
        this.translateX(0)
        this.refresh = true
        this.router.navigateByUrl(`/feed/${feed.id}`)
    }

    openMoreBox(event) {
        event.stopPropagation()

        if (this.moreBoxVisible) {
            this.closeMoreBox()
        } else {
            this.moreBoxVisible = true
        }
    }

    closeMoreBox() {
        this.moreBoxVisible = false
    }

    deleteFeed(feed: Feed) {
        this.feedService.deleteFeed(feed.id).subscribe(
            (v) => {
                this.router.navigateByUrl('/feed')
            },
            (e) => {}
        )
    }

    showCommentView() {
        if (this.storageService.getUser()) {
            this.getFeedCommentList()
            this.commentViewVisible = true
        } else {
            this.router.navigateByUrl('/auth/login')
        }
    }

    hideCommentView() {
        this.clearCommentInput()
        this.commentViewVisible = false
    }

    clearCommentInput() {
        this.feedCommentInput = ''
    }

    createComment() {
        if (!this.feedCommentInput) {
            return
        }

        this.feedService.createFeedComment(this.selectedFeed.id, { text: this.feedCommentInput }).subscribe(
            (feedComment: FeedComment) => {
                this.clearCommentInput()
                this.selectedFeed.comment_count++
                this.feedCommentList.unshift(feedComment)
            },
            (e) => {}
        )
    }

    showSubCommentInput(feedCommentId: string) {
        this.feedSubCommentInputViewObj[feedCommentId] = true
    }

    hideSubCommentInput(feedCommentId: string) {
        this.feedSubCommentInputViewObj[feedCommentId] = false
        this.feedSubCommentInputValueObj[feedCommentId] = ''
    }

    showSubCommentList(feedCommentId: string) {
        if (this.feedSubCommentListViewObj[feedCommentId]) {
            this.hideSubCommentList(feedCommentId)
        } else {
            this.feedSubCommentListViewObj[feedCommentId] = true
            this.getFeedSubCommentList(feedCommentId)
        }
    }

    hideSubCommentList(feedCommentId: string) {
        this.feedSubCommentListViewObj[feedCommentId] = false
        this.feedSubCommentListObj[feedCommentId] = []
    }

    createSubComment(feedCommentId: string) {
        if (!this.feedSubCommentInputValueObj[feedCommentId]) {
            return
        }

        this.feedService
            .createFeedComment(this.selectedFeed.id, {
                parent_id: feedCommentId,
                text: this.feedSubCommentInputValueObj[feedCommentId],
            })
            .subscribe(
                (feedComment: FeedComment) => {
                    this.hideSubCommentInput(feedCommentId)
                    this.selectedFeed.comment_count++
                    this.feedSubCommentListViewObj[feedCommentId] = true
                    if (!this.feedSubCommentListObj[feedCommentId]) {
                        this.feedSubCommentListObj[feedCommentId] = [feedComment]
                    } else {
                        this.feedSubCommentListObj[feedCommentId].unshift(feedComment)
                    }
                },
                (e) => {}
            )
    }

    deleteComment(feedComment: FeedComment) {
        this.feedService.deleteFeedComment(this.selectedFeed.id, feedComment.id).subscribe(
            (v) => {
                this.selectedFeed.comment_count--
                feedComment.deleted_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
            },
            (e) => {}
        )
    }

    showLikedView() {
        if (this.storageService.getUser()) {
            this.likedViewVisible = true
        } else {
            this.router.navigateByUrl('/auth/login')
        }
    }

    hideLikedView() {
        this.likedViewVisible = false
    }
}
