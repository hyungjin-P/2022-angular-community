import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FileService } from '@services/file.service'
import { UserService } from '@services/user.service'

import { User } from '@schemas/user'
import { File } from '@schemas/file'

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    user: User

    selectedLanguage: string

    currentPicture: any
    currentNickname: string
    nicknameErrorText: string
    aboutMeText: string
    aboutMeInfoText: string
    aboutMeErrorText: string

    constructor(
        private location: Location,
        private globalService: GlobalService,
        private storageService: StorageService,
        private fileService: FileService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.user = this.storageService.getUser()

        this.selectedLanguage = localStorage.getItem('language')

        this.currentPicture = this.user.picture.length == 0 ? null : this.user.picture[0]['url']
        this.currentNickname = this.user.nickname
        this.checkNickname()
        this.aboutMeText = this.user.about_me
        if (this.selectedLanguage == 'ko') {
            this.aboutMeInfoText = '최대 30자까지 간단 소개글을 입력해 주세요.'
        } else {
            this.aboutMeInfoText = 'Please enter a brief introduction of up to 30 characters.'
        }
        this.aboutMeErrorText = ''
    }

    goBack() {
        this.location.back()
    }

    onChangeFile(picture) {
        const files: FileList = picture.files

        if (files && files.length == 0) {
            return
        }

        const reader = new FileReader()

        reader.onload = (event) => {
            this.currentPicture = event.target.result
        }

        reader.readAsDataURL(files[0])
    }

    checkDuplicateNickname() {
        if (!this.currentNickname) {
            return
        }

        this.userService.checkDuplicateNickname(this.user.id, { nickname: this.currentNickname }).subscribe(
            (v) => {
                if (this.selectedLanguage == 'ko') {
                    this.globalService.showToast('사용가능한 닉네임입니다.')
                } else {
                    this.globalService.showToast('Available nickname.')
                }
            },
            (e) => {
                if (e.code == 'FUNCTION:USER:002') {
                    if (this.selectedLanguage == 'ko') {
                        this.nicknameErrorText = '사용중인 닉네임입니다.'
                    } else {
                        this.nicknameErrorText = 'This nickname is already using.'
                    }
                } else {
                    this.nicknameErrorText = e.message
                }
            }
        )
    }

    onKeyup(event, type) {
        this.checkNickname()
    }

    checkNickname() {
        if (!this.currentNickname) {
            if (this.selectedLanguage == 'ko') {
                this.nicknameErrorText = '닉네임을 입력해주세요.'
            } else {
                this.nicknameErrorText = 'Please enter your nickname.'
            }
        } else {
            this.nicknameErrorText = ''
        }
    }

    async updateUser(picture) {
        const files: FileList = picture.files

        if (files && files.length > 0) {
            let createdFiles: Array<File> = await this.fileService
                .createFile(
                    {
                        domain_name: 'public.keeping.link',
                        path: `/users/${this.user.id}/picture`,
                        tags: ['user-picture'],
                    },
                    files
                )
                .toPromise()

            for (let i = 0; i < createdFiles.length; i++) {
                await this.userService.createUserPicture(this.user.id, { files: createdFiles }).toPromise()
            }

            this.user.picture = createdFiles.concat(this.user.picture)
            this.storageService.setUser(this.user)

            this.globalService.user.picture = createdFiles[0]
        }
    }
}
