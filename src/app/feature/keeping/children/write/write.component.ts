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

declare const $;

@Component({
    selector: 'write',
    templateUrl: './write.component.html',
    styleUrls: ['./write.component.scss'],
})
export class WriteComponent implements OnInit, AfterViewInit {
    @ViewChild('pictureBoxElement') pictureBoxElement

    user: User

    slideIndex: number

    title: string
    content: string
    pictureBoxVisible: boolean

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

        this.slideIndex = 0;
        this.title = ''
        this.content = ''
        this.pictureBoxVisible = true

        this.selectedLanguage = localStorage.getItem('language')
        this.createFeed()

        this.tagModalVisible = false
    }

    ngAfterViewInit(): void {
        $('#carousel-addPicture').carousel({
            interval: 0
        })
    }

    goBack() {
        this.location.back()
    }

    showPictureBox() {
        this.pictureBoxVisible = !this.pictureBoxVisible
    }

    changeSlideIndex(index){
        this.slideIndex = index;
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

            if (this.feed.pictures.length === 1){
                this.checkMainPicture(this.feed.pictures[0].url)
            }

            picture.value = ''
        } catch (e) {}
    }

    async deletePicture(index: number, fileUrl: string) {
        try {
            // 현위치 확인한 후 지우기
            if (this.slideIndex === index && this.feed.pictures.length !== 1){
                $('#carousel-addPicture').carousel('next')
            }

            await this.fileService.deleteFile(fileUrl).toPromise()
            await this.feedService.deleteUserPicture(this.feed.id, fileUrl).toPromise()
            this.feed.pictures.splice(index, 1)

            if (this.feed.picture == fileUrl || this.feed.pictures.length == 0) {
                this.checkMainPicture('')
            }
        } catch (e) {}
    }

    toPos(obs$) {
        const SUPPORT_TOUCH = 'ontouchstart' in window
        return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)))
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
