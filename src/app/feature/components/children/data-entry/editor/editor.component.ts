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
    @ViewChild('singleImageElement') singleImageElement
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
        dom.innerHTML = ``

        let children = Array.from(dom.children)
        children.forEach((element: HTMLElement) => {
            let deleteIcon = element.querySelector('.mdi-delete-sweep-outline')
            deleteIcon.addEventListener('click', this.deleteElement.bind(this, element))

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

    insertParagraph() {
        let element = document.createElement('div')
        element.classList.add('editor-content', 'editor-content-paragraph')

        this.addParagraphMenuBox(element)

        let text = document.createElement('div')
        text.classList.add('editor-content-paragraph-text')
        text.contentEditable = 'true'
        element.appendChild(text)

        this.contentElement.nativeElement.appendChild(element)
    }

    addParagraphMenuBox(element: HTMLElement) {
        let menuBox = document.createElement('div')
        menuBox.classList.add('editor-content-menu-box')

        let menu = `
            <div class="editor-content-menu" onclick="document.execCommand('undo')">
                <div class="mdi mdi-undo"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('redo')">
                <div class="mdi mdi-redo"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('bold')">
                <div class="mdi mdi-format-bold"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('italic')">
                <div class="mdi mdi-format-italic"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('underline')">
                <div class="mdi mdi-format-underline"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('strikeThrough')">
                <div class="mdi mdi-format-strikethrough"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('subscript')">
                <div class="mdi mdi-format-subscript"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('superscript')">
                <div class="mdi mdi-format-superscript"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('justifyLeft')">
                <div class="mdi mdi-format-align-left"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('justifyCenter')">
                <div class="mdi mdi-format-align-center"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('justifyRight')">
                <div class="mdi mdi-format-align-right"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('justifyFull')">
                <div class="mdi mdi-format-align-justify"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('indent')">
                <div class="mdi mdi-format-indent-increase"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('outdent')">
                <div class="mdi mdi-format-indent-decrease"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('insertOrderedList')">
                <div class="mdi mdi-format-list-numbered"></div>
            </div>
            <div class="editor-content-menu" onclick="document.execCommand('insertUnorderedList')">
                <div class="mdi mdi-format-list-bulleted"></div>
            </div>
        `

        menuBox.innerHTML = menu

        let cursorMoveMenu = document.createElement('div')
        cursorMoveMenu.classList.add('editor-content-menu')
        let cursorMoveIcon = document.createElement('div')
        cursorMoveIcon.classList.add('mdi', 'mdi-cursor-move')
        cursorMoveMenu.appendChild(cursorMoveIcon)
        menuBox.appendChild(cursorMoveMenu)

        let deleteMenu = document.createElement('div')
        deleteMenu.classList.add('editor-content-menu')
        let deleteIcon = document.createElement('div')
        deleteIcon.classList.add('mdi', 'mdi-delete-sweep-outline')
        deleteMenu.addEventListener('click', this.deleteElement.bind(this, element))
        deleteMenu.appendChild(deleteIcon)
        menuBox.appendChild(deleteMenu)

        element.appendChild(menuBox)
    }

    async insertSingleImage() {
        const files: FileList = this.singleImageElement.nativeElement.files

        if (files && files.length == 0) {
            return
        }

        try {
            let createdFiles: Array<File> = await this.fileService
                .createFile(
                    {
                        domain_name: 'public.keeping.link',
                        path: `/users/${this.user.id}/post`,
                        tags: ['post'],
                    },
                    files
                )
                .toPromise()

            let element = document.createElement('div')
            element.classList.add('editor-content', 'editor-content-single-image')

            this.addSingleImageMenuBox(element)

            let img = document.createElement('img')
            img.src = createdFiles[0]['url']
            element.appendChild(img)

            this.contentElement.nativeElement.appendChild(element)
        } catch (e) {}
    }

    addSingleImageMenuBox(element: HTMLElement) {
        let menuBox = document.createElement('div')
        menuBox.classList.add('editor-content-menu-box')

        let justifyContentLeftMenu = document.createElement('div')
        justifyContentLeftMenu.classList.add('editor-content-menu')
        let justifyContentLeft = document.createElement('div')
        justifyContentLeft.classList.add('mdi', 'mdi-format-align-left')
        justifyContentLeftMenu.addEventListener(
            'click',
            this.justifyContent.bind(this, element, 'editor-justify-content-left')
        )
        justifyContentLeftMenu.appendChild(justifyContentLeft)
        menuBox.appendChild(justifyContentLeftMenu)

        let justifyContentCenterMenu = document.createElement('div')
        justifyContentCenterMenu.classList.add('editor-content-menu')
        let justifyContentCenter = document.createElement('div')
        justifyContentCenter.classList.add('mdi', 'mdi-format-align-center')
        justifyContentCenterMenu.addEventListener(
            'click',
            this.justifyContent.bind(this, element, 'editor-justify-content-center')
        )
        justifyContentCenterMenu.appendChild(justifyContentCenter)
        menuBox.appendChild(justifyContentCenterMenu)

        let justifyContentRightMenu = document.createElement('div')
        justifyContentRightMenu.classList.add('editor-content-menu')
        let justifyContentRight = document.createElement('div')
        justifyContentRight.classList.add('mdi', 'mdi-format-align-right')
        justifyContentRightMenu.addEventListener(
            'click',
            this.justifyContent.bind(this, element, 'editor-justify-content-right')
        )
        justifyContentRightMenu.appendChild(justifyContentRight)
        menuBox.appendChild(justifyContentRightMenu)

        let cursorMoveMenu = document.createElement('div')
        cursorMoveMenu.classList.add('editor-content-menu')
        let cursorMoveIcon = document.createElement('div')
        cursorMoveIcon.classList.add('mdi', 'mdi-cursor-move')
        cursorMoveMenu.appendChild(cursorMoveIcon)
        menuBox.appendChild(cursorMoveMenu)

        let deleteMenu = document.createElement('div')
        deleteMenu.classList.add('editor-content-menu')
        let deleteIcon = document.createElement('div')
        deleteIcon.classList.add('mdi', 'mdi-delete-sweep-outline')
        deleteMenu.addEventListener('click', this.deleteElement.bind(this, element))
        deleteMenu.appendChild(deleteIcon)
        menuBox.appendChild(deleteMenu)

        element.appendChild(menuBox)
    }

    justifyContent(element: HTMLElement, align: string) {
        element.classList.remove(
            'editor-justify-content-left',
            'editor-justify-content-center',
            'editor-justify-content-right'
        )

        element.classList.add(align)
    }

    deleteElement(element: HTMLElement) {
        element.remove()
    }

    export() {
        console.log('htmlString:', this.contentElement.nativeElement.innerHTML)
    }
}
