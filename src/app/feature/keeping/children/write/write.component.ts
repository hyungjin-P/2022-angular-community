import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
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

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FeedService } from '@services/feed.service'
import { FileService } from '@services/file.service'
import { TextService } from '@services/text.service'

import { Feed } from '@schemas/feed'
import { FeedTag } from '@schemas/feed-tag'
import { User } from '@schemas/user'
import { File } from '@schemas/file'

@Component({
    selector: 'write',
    templateUrl: './write.component.html',
    styleUrls: ['./write.component.scss'],
})
export class WriteComponent implements OnInit, AfterViewInit {
    @ViewChild('pictureBoxElement') pictureBoxElement

    user: User

    title: string
    content: string
    pictureBoxVisible: boolean

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

    carousel$

    selectedLanguage: string
    feed: Feed

    tagModalVisible: boolean
    tagModalInput: string

    constructor(
        private router: Router,
        private location: Location,
        private globalService: GlobalService,
        private storageService: StorageService,
        private feedService: FeedService,
        private fileService: FileService,
        private textService: TextService
    ) {}

    ngOnInit() {
        this.user = this.storageService.getUser()

        this.title = ''
        this.content = ''
        this.pictureBoxVisible = true

        this.selectedLanguage = localStorage.getItem('language')
        this.createFeed()

        this.tagModalVisible = false
    }

    goBack() {
        this.location.back()
    }

    showPictureBox() {
        this.pictureBoxVisible = !this.pictureBoxVisible
    }

    async addPicture(picture) {
        const files: FileList = picture.files

        if (files && files.length == 0) {
            return
        }

        let picturesLength = this.feed.pictures.length + files.length
        if (picturesLength > 8) {
            return
        }

        try {
            let createdFiles: Array<File> = await this.fileService
                .createFile(
                    {
                        domain_name: 'public.keeping.link',
                        path: `/users/${this.user.id}/feed`,
                        tags: ['feed'],
                    },
                    files
                )
                .toPromise()

            await this.feedService.createFeedPicture(this.feed.id, { files: createdFiles }).toPromise()

            this.feed.pictures = createdFiles.concat(this.feed.pictures)

            picture.value = ''
        } catch (e) {}
    }

    async deletePicture(index: number, fileUrl: string) {
        try {
            await this.fileService.deleteFile(fileUrl).toPromise()
            await this.feedService.deleteUserPicture(this.feed.id, fileUrl).toPromise()
            this.feed.pictures.splice(index, 1)

            if (this.feed.picture == fileUrl || this.feed.pictures.length == 0) {
                this.checkMainPicture('')
            }
        } catch (e) {}
    }

    async clickAddedPicture(index: number){
        try{
            console.log("index : " + index + "now : " + this.feed.pictures)
        } catch (e) {}
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
                        let tobeIndex = store.index
                        if (Math.abs(distance) >= THRESHOLD) {
                            tobeIndex =
                                distance >= 0
                                    ? Math.max(tobeIndex - 1, 0)
                                    : Math.min(tobeIndex + 1, this.feed.pictures.length - 1)
                        }
                        updateStore.index = tobeIndex
                        updateStore.to = -(tobeIndex * size)
                        updateStore.size = size
                    }

                    return {
                        ...store,
                        ...updateStore,
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

    createFeed() {
        this.feedService.createFeed({ rewrite: false }).subscribe(
            (feed: Feed) => {
                this.feed = feed
                this.content = feed.content
            },
            (e) => {}
        )
    }

    checkMainPicture(url: string) {
        this.feedService.updateFeed(this.feed.id, { picture: url }).subscribe(
            (feed: Feed) => {
                this.feed.picture = url
            },
            (e) => {}
        )
    }

    updateContent() {
        this.feedService.updateFeed(this.feed.id, { content: this.content }).subscribe(
            (v) => {},
            (e) => {}
        )
    }

    showTagModal() {
        this.tagModalVisible = true
    }

    hideTagModal() {
        this.clearTagModal()
        this.tagModalVisible = false
    }

    clearTagModal() {
        this.tagModalInput = ''
    }

    addTag() {
        if (this.feed.tags.length >= 10 || !this.tagModalInput) {
            this.hideTagModal()
            return
        }

        this.feedService.createFeedTag(this.feed.id, { name: this.tagModalInput }).subscribe(
            (feedTag: FeedTag) => {
                this.feed.tags.push(feedTag)
                this.hideTagModal()
            },
            (e) => {}
        )
    }

    deleteTag(index: number, tagId: string) {
        this.feedService.deleteFeedTag(this.feed.id, tagId).subscribe(
            (v) => {
                this.feed.tags.splice(index, 1)
            },
            (e) => {}
        )
    }

    posting() {
        if (!this.feed.picture) {
            let message = this.textService.getText('write:feed:001')
            this.globalService.showToast(message)
            return
        }

        if (this.content == '') {
            let message = this.textService.getText('write:feed:002')
            this.globalService.showToast(message)
            return
        }

        this.feedService.updateFeed(this.feed.id, { posting: true }).subscribe(
            (v) => {
                // this.createFeed()
                // let message = this.textService.getText('write:feed:003')
                // this.globalService.showToast(message)
                this.router.navigateByUrl('/feed')
            },
            (e) => {}
        )
    }
}
