import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
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

import { Feed } from '@schemas/feed'
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
    panelCount: number

    selectedLanguage: string
    feed: Feed

    constructor(
        private location: Location,
        private globalService: GlobalService,
        private storageService: StorageService,
        private feedService: FeedService,
        private fileService: FileService
    ) {}

    ngOnInit() {
        this.user = this.storageService.getUser()

        this.title = ''
        this.content = ''
        this.pictureBoxVisible = true

        this.panelCount = 0

        this.selectedLanguage = localStorage.getItem('language')
        this.createFeed()
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

            // Preview - picture-box
            let element = document.createElement('div')
            element.classList.add('write-added-picture')

            let img = document.createElement('img')
            img.src = createdFiles[0]['url']
            img.dataset.origin = createdFiles[0]['url']

            let deleteMenu = document.createElement('div')
            deleteMenu.classList.add('write-added-picture-delete-menu')
            let deleteIcon = document.createElement('div')
            deleteIcon.classList.add('mdi', 'mdi-close')
            deleteMenu.addEventListener(
                'click',
                function () {
                    this.deletePicture(createdFiles[0]['url'])
                    element.remove()
                    carouselPanel.remove()
                    this.panelCount--
                }.bind(this)
            )
            deleteMenu.appendChild(deleteIcon)

            element.appendChild(img)
            element.appendChild(deleteMenu)

            this.pictureBoxElement.nativeElement.appendChild(element)

            // Carousel
            let carouselPanel = document.createElement('li')
            carouselPanel.classList.add('write-added-picture-carousel-panel')

            let carouselPanelDiv = document.createElement('div')

            let carouselPanelImgWrapper = document.createElement('div')
            carouselPanelImgWrapper.classList.add('write-added-picture-carousel-panel-img-wrapper')

            let carouselPanelImg = document.createElement('img')
            carouselPanelImg.src = createdFiles[0]['url']
            carouselPanelImg.dataset.origin = createdFiles[0]['url']
            carouselPanelImg.draggable = false

            carouselPanelImgWrapper.appendChild(carouselPanelImg)

            let carouselPanelDeleteMenu = document.createElement('div')
            carouselPanelDeleteMenu.classList.add('write-added-picture-carousel-panel-delete-menu')
            let carouselPanelDeleteIcon = document.createElement('div')
            carouselPanelDeleteIcon.classList.add('mdi', 'mdi-close')
            carouselPanelDeleteMenu.addEventListener(
                'click',
                function () {
                    this.deletePicture(createdFiles[0]['url'])
                    element.remove()
                    carouselPanel.remove()
                    this.panelCount--
                }.bind(this)
            )
            carouselPanelDeleteMenu.appendChild(carouselPanelDeleteIcon)

            let carouselPanelMainPictureMenu = document.createElement('div')
            carouselPanelMainPictureMenu.classList.add('write-added-picture-carousel-panel-main-picture-menu')
            let carouselPanelMainPictureIcon = document.createElement('div')
            carouselPanelMainPictureIcon.classList.add('mdi', 'mdi-check')
            carouselPanelMainPictureMenu.addEventListener('click', function () {}.bind(this))
            let carouselPanelMainPictureText = document.createElement('div')
            let text = this.selectedLanguage == 'ko' ? '메인' : 'Main'
            carouselPanelMainPictureText.innerText = text

            carouselPanelMainPictureMenu.appendChild(carouselPanelMainPictureIcon)
            carouselPanelMainPictureMenu.appendChild(carouselPanelMainPictureText)

            carouselPanelDiv.appendChild(carouselPanelImgWrapper)
            carouselPanelDiv.appendChild(carouselPanelDeleteMenu)
            carouselPanelDiv.appendChild(carouselPanelMainPictureMenu)
            carouselPanel.appendChild(carouselPanelDiv)

            this.container.nativeElement.appendChild(carouselPanel)

            this.panelCount++
            picture.value = ''
        } catch (e) {}
    }

    async deletePicture(fileUrl: string) {
        try {
            await this.fileService.deleteFile(fileUrl).toPromise()
            await this.feedService.deleteUserPicture(this.feed.id, fileUrl).toPromise()
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
                                    : Math.min(tobeIndex + 1, this.panelCount - 1)
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

                this.feed.pictures.forEach((picture, index) => {
                    // Preview - picture-box
                    let element = document.createElement('div')
                    element.classList.add('write-added-picture')

                    let img = document.createElement('img')
                    img.src = picture['url']
                    img.dataset.origin = picture['url']

                    let deleteMenu = document.createElement('div')
                    deleteMenu.classList.add('write-added-picture-delete-menu')
                    let deleteIcon = document.createElement('div')
                    deleteIcon.classList.add('mdi', 'mdi-close')
                    deleteMenu.addEventListener(
                        'click',
                        function () {
                            this.deletePicture(picture['url'])
                            element.remove()
                            carouselPanel.remove()
                            this.panelCount--
                        }.bind(this)
                    )
                    deleteMenu.appendChild(deleteIcon)

                    element.appendChild(img)
                    element.appendChild(deleteMenu)

                    this.pictureBoxElement.nativeElement.appendChild(element)

                    // Carousel
                    let carouselPanel = document.createElement('li')
                    carouselPanel.classList.add('write-added-picture-carousel-panel')

                    let carouselPanelDiv = document.createElement('div')

                    let carouselPanelImgWrapper = document.createElement('div')
                    carouselPanelImgWrapper.classList.add('write-added-picture-carousel-panel-img-wrapper')

                    let carouselPanelImg = document.createElement('img')
                    carouselPanelImg.src = picture['url']
                    carouselPanelImg.dataset.origin = picture['url']
                    carouselPanelImg.draggable = false

                    carouselPanelImgWrapper.appendChild(carouselPanelImg)

                    let carouselPanelDeleteMenu = document.createElement('div')
                    carouselPanelDeleteMenu.classList.add('write-added-picture-carousel-panel-delete-menu')
                    let carouselPanelDeleteIcon = document.createElement('div')
                    carouselPanelDeleteIcon.classList.add('mdi', 'mdi-close')
                    carouselPanelDeleteMenu.addEventListener(
                        'click',
                        function () {
                            this.deletePicture(picture['url'])
                            element.remove()
                            carouselPanel.remove()
                            this.panelCount--
                        }.bind(this)
                    )
                    carouselPanelDeleteMenu.appendChild(carouselPanelDeleteIcon)

                    carouselPanelDiv.appendChild(carouselPanelImgWrapper)
                    carouselPanelDiv.appendChild(carouselPanelDeleteMenu)
                    carouselPanel.appendChild(carouselPanelDiv)

                    this.container.nativeElement.appendChild(carouselPanel)
                })

                this.panelCount = this.feed.pictures.length
            },
            (e) => {}
        )
    }
}
