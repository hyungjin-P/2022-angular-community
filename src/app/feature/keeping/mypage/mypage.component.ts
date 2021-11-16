import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { UserService } from '@services/user.service'
import { FileService } from '@services/file.service'

import { User } from '@schemas/user'
import { File } from '@schemas/file'

@Component({
    selector: 'mypage',
    templateUrl: './mypage.component.html',
    styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit {
    variables: any
    globalUser: any
    user: User

    backgroundEditMode: boolean

    constructor(
        private router: Router,
        private location: Location,
        private globalService: GlobalService,
        private storageService: StorageService,
        private userService: UserService,
        private fileService: FileService
    ) {}

    ngOnInit() {
        this.variables = this.globalService.variables
        this.globalUser = this.globalService.user
        this.user = this.storageService.getUser()

        this.closeDrawer()
    }

    goBack() {
        this.location.back()
    }

    closeDrawer() {
        this.variables.isDrawerOpen = false
    }

    async onChangeFile(background) {
        const files: FileList = background.files

        if (files && files.length == 0) {
            return
        }

        try {
            let createdFiles: Array<File> = await this.fileService
                .createFile(
                    {
                        domain_name: 'public.keeping.link',
                        path: `/users/${this.user.id}/background`,
                        tags: ['user-background'],
                    },
                    files
                )
                .toPromise()

            for (let i = 0; i < createdFiles.length; i++) {
                await this.userService.createUserBackground(this.user.id, { files: createdFiles }).toPromise()
            }

            this.user.background = createdFiles.concat(this.user.background)
            this.storageService.setUser(this.user)

            background.value = ''
        } catch (e) {
            this.globalService.showToast(e.message)
        }
    }

    changeBackgroundEditMode(value: boolean) {
        this.backgroundEditMode = value
    }

    async deleteBackground(url) {
        try {
            await this.userService.deleteUserBackground(this.user.id, url).toPromise()

            this.changeBackgroundEditMode(false)
            this.user.background = []
            this.storageService.setUser(this.user)
        } catch (e) {
            this.globalService.showToast(e.message)
        }
    }

    async changeBackground(background) {
        const files: FileList = background.files

        if (files && files.length == 0) {
            return
        }

        try {
            let createdFiles: Array<File> = await this.fileService
                .createFile(
                    {
                        domain_name: 'public.keeping.link',
                        path: `/users/${this.user.id}/background`,
                        tags: ['user-background'],
                    },
                    files
                )
                .toPromise()

            for (let i = 0; i < createdFiles.length; i++) {
                await this.userService.createUserBackground(this.user.id, { files: createdFiles }).toPromise()
            }

            let oldBackgroundUrl = this.user.background[0]['url']

            this.user.background = createdFiles
            this.storageService.setUser(this.user)

            background.value = ''

            await this.userService.deleteUserBackground(this.user.id, oldBackgroundUrl).toPromise()

            this.changeBackgroundEditMode(false)
        } catch (e) {
            this.globalService.showToast(e.message)
        }
    }

    async logout() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/')
    }
}
