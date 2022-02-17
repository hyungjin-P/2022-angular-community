import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { UserService } from '@services/user.service'
import { FileService } from '@services/file.service'
import { TextService } from '@services/text.service'

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
    currentAboutMeText: string
    aboutMeInfoText: string
    aboutMeErrorText: string

    constructor(
        private location: Location,
        private globalService: GlobalService,
        private storageService: StorageService,
        private fileService: FileService,
        private userService: UserService,
        private textService: TextService
    ) {}

    ngOnInit() {
        this.user = this.storageService.getUser()

        this.selectedLanguage = localStorage.getItem('language')

        this.currentPicture = this.user.picture?.length == 0 ? null : this.user.picture[0]['url']
        this.currentNickname = this.user.nickname
        this.checkNickname()
        this.currentAboutMeText = this.user.aboutMe ? this.user.aboutMe : ''
        // 최대 30자까지 간단 소개글을 입력해 주세요.
        this.aboutMeInfoText = this.textService.getText('settings:profile:001')
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
                // 사용가능한 닉네임입니다.
                let message = this.textService.getText('settings:profile:002')
                this.globalService.showToast(message)
            },
            (e) => {
                if (e.code == 'FUNCTION:USER:002') {
                    // 사용중인 닉네임입니다.
                    this.nicknameErrorText = this.textService.getText('settings:profile:003')
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
            // 닉네임을 입력해주세요.
            this.nicknameErrorText = this.textService.getText('settings:profile:004')
        } else {
            this.nicknameErrorText = ''
        }
    }

    async updateUser(picture) {
        if (!this.currentNickname) {
            return
        }

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

            await this.userService.createUserPicture(this.user.id, { files: createdFiles }).toPromise()

            this.user.picture = createdFiles.concat(this.user.picture)
            this.storageService.setUser(this.user)

            this.globalService.user.picture = createdFiles[0]

            picture.value = ''
        }

        this.userService
            .updateUser(this.user.id, { nickname: this.currentNickname, about_me: this.currentAboutMeText })
            .subscribe(
                (user: User) => {
                    this.user.nickname = user.nickname
                    this.user.aboutMe = user.aboutMe
                    this.storageService.setUser(this.user)

                    // 프로필이 수정되었습니다.
                    let message = this.textService.getText('settings:profile:005')
                    this.globalService.showToast(message)
                },
                (e) => {
                    this.globalService.showToast(e.message)
                }
            )
    }
}
