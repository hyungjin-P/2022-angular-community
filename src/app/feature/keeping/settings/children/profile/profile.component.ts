import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FileService } from '@services/file.service'
import { UserService } from '@services/user.service'

import { User } from '@schemas/user'

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    user: User

    selectedLanguage: string

    currentPicture: any
    nicknameErrorText: string
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
        this.nicknameErrorText = ''
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

        // this.fileService.createFile({ tag: 'user-profile' }, files).subscribe(
        //     (fileList) => {
        //         const location = fileList[0]['location']

        //         this.userService.updateUser(this.user.id, { picture: location }).subscribe(
        //             (user) => {
        //                 this.user.picture = user['picture']

        //                 this.storageService.setUser(user)
        //             },
        //             (e) => {}
        //         )
        //     },
        //     (e) => {}
        // )
    }

    updateUser() {}
}
