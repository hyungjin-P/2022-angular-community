import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core'
import { DragulaService } from 'ng2-dragula'
import { Subscription, Subject } from 'rxjs'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FileService } from '@services/file.service'

import { User } from '@schemas/user'
import { File } from '@schemas/file'

@Component({
    selector: 'editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('insertImageElement') insertImageElement
    @ViewChild('contentElement') contentElement

    user: User

    subscription: Subscription

    selectedEditorParagraphElement: HTMLElement

    constructor(
        private dragulaService: DragulaService,
        private globalService: GlobalService,
        private storageService: StorageService,
        private fileService: FileService
    ) {}

    ngOnInit() {
        this.user = this.storageService.getUser()

        this.subscription = new Subscription()

        this.initDragula()
    }

    ngAfterViewInit() {
        let dom = document.createElement('div')
        dom.innerHTML = `<div class="editor-paragraph"><div class="mdi mdi-cursor-move"></div><div class="mdi mdi-delete-sweep-outline"></div><div class="text" contenteditable="true">asdfasdf<div>asdf</div><div>asd</div><div><br></div><div><br></div><div>a</div><div>sdf</div></div></div><div class="editor-paragraph"><div class="mdi mdi-cursor-move"></div><div class="mdi mdi-delete-sweep-outline"></div><div class="text" contenteditable="true"><b>dfasdfasdf</b><div>d</div><div>s</div><div>s</div><div><br></div><div><br></div><div>s</div></div></div><div class="editor-paragraph"><div class="mdi mdi-cursor-move"></div><div class="mdi mdi-delete-sweep-outline"></div><div class="text" contenteditable="true">f<div><br></div><div><br></div></div></div><div class="editor-paragraph"><div class="mdi mdi-cursor-move"></div><div class="mdi mdi-delete-sweep-outline"></div><div class="text" contenteditable="true">1</div></div>`

        let children = Array.from(dom.children)
        console.log(children)

        children.forEach((element: HTMLElement) => {
            let deleteIcon = element.querySelector('.mdi-delete-sweep-outline')
            deleteIcon.addEventListener('click', this.deleteElement.bind(this, element))

            console.log('element:', element)
            this.contentElement.nativeElement.appendChild(element)
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
        this.dragulaService.destroy('ITEMS')
    }

    initDragula() {
        this.dragulaService.createGroup('ITEMS', {
            moves: (el, source, handle) => {
                return handle.className === 'mdi mdi-cursor-move'
            },
        })

        this.subscription.add(
            this.dragulaService
                .dropModel('ITEMS')
                .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
                    const targetItemIndex = this.getIndexInItems(el) + 1
                })
        )
    }

    getIndexInItems(el: any) {
        return Array.from(el.parentNode.children).indexOf(el)
    }

    setStyle(style) {
        document.execCommand(style)

        this.focusContent()
    }

    focusContent() {
        this.contentElement.nativeElement.focus({ preventScroll: true })
    }

    async insertImage() {
        console.log(this.selectedEditorParagraphElement)
        const files: FileList = this.insertImageElement.nativeElement.files

        if (files && files.length == 0) {
            return
        }

        try {
            let createdFiles: Array<File> = await this.fileService
                .createFile(
                    {
                        domain_name: 'public.keeping.link',
                        path: `/users/${this.user.id}/write`,
                        tags: ['write'],
                    },
                    files
                )
                .toPromise()

            let img = document.createElement('img')
            img.src = createdFiles[0]['url']
            this.focusContent()
            let textElement = this.selectedEditorParagraphElement.querySelector('.text')
            textElement.append(img)
        } catch (e) {}
    }

    insertParagraph() {
        let element = document.createElement('div')
        element.classList.add('editor-paragraph')

        let cursorMoveIcon = document.createElement('div')
        cursorMoveIcon.classList.add('mdi', 'mdi-cursor-move')
        let deleteIcon = document.createElement('div')
        deleteIcon.classList.add('mdi', 'mdi-delete-sweep-outline')
        deleteIcon.addEventListener('click', this.deleteElement.bind(this, element))
        let text = document.createElement('div')
        text.classList.add('text')
        text.contentEditable = 'true'
        let imageIcon = document.createElement('div')
        imageIcon.classList.add('mdi', 'mdi-image-area')
        imageIcon.addEventListener(
            'click',
            function () {
                this.selectedEditorParagraphElement = element
                this.insertImageElement.nativeElement.click()
            }.bind(this)
        )

        element.appendChild(imageIcon)
        element.appendChild(cursorMoveIcon)
        element.appendChild(deleteIcon)
        element.appendChild(text)

        this.contentElement.nativeElement.appendChild(element)
    }

    deleteElement(element: HTMLElement) {
        element.remove()
    }

    export() {
        // let htmlString = this.contentElement.nativeElement.html()

        console.log('htmlString:', this.contentElement.nativeElement.innerHTML)
    }
}
