import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

import { StorageService } from '@services/storage.service'

import { ChatService } from '@services/chat.service'

@Component({
    selector: 'components',
    templateUrl: './components.component.html',
    styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent implements OnInit {
    constructor(private storageService: StorageService, private chatService: ChatService) {}

    ngOnInit() {}

    // Checkbox
    checkbox = true
    clickCheckbox() {
        this.checkbox = !this.checkbox
    }

    // Radio Button
    radio = true
    clickRadio() {
        this.radio = !this.radio
    }

    // Switch
    switch1 = true
    switch2 = true
    switch3 = false

    // Select
    dropboxItems = [
        {
            name: '옵션 1',
            value: 'option 1',
        },
        {
            name: '옵션 2',
            value: 'option 2',
            disabled: true,
        },
        {
            name: '옵션 3',
            value: 'option 3',
        },
        {
            name: '옵션 4',
            value: 'option 4',
        },
    ]
    selectedDropboxItem = {
        name: '옵션 1',
        value: 'option 1',
    }

    // Avatar
    picture = ''

    // DatePicker
    data1: any = {
        date: '2021-03-10',
    }
    data2: any = {
        startDate: '2021-03-14',
        endDate: '2021-03-20',
    }
    data3 = []

    // TimePicker
    timeData = ''

    // button
    buttonDisabled
    toggleButtonDisabled() {
        this.buttonDisabled = !this.buttonDisabled
    }

    // Modal
    isVisible = false
    visibleData = {
        text: '문구를 입력해주세요.',
        subText: `서브 텍스트 문구를 입력해주세요.
        서브 텍스트 문구를 입력해주세요.`,
        cancelButtonText: '취소', // 선택
        confirmButtonText: '저장', // 선택
    }

    showModal() {
        this.isVisible = true
    }

    handleOk(): void {
        console.log('Button ok clicked!')
        this.isVisible = false
    }

    handleCancel(): void {
        console.log('Button cancel clicked!')
        this.isVisible = false
    }

    isVisible2 = false
    visibleData2 = {
        text: '문구를 입력해주세요.',
        subText: `서브 텍스트 문구를 입력해주세요.
        서브 텍스트 문구를 입력해주세요.`,
        confirmButtonText: '확인', // 선택
    }

    showModal2() {
        this.isVisible2 = true
    }

    handleOk2(): void {
        console.log('Button ok clicked!')
        this.isVisible2 = false
    }

    handleCancel2(): void {
        console.log('Button cancel clicked!')
        this.isVisible2 = false
    }

    // Toast
    toastVisible = false
    toastText = '초대가 거절되었습니다.'

    showToast() {
        this.toastVisible = true
    }

    hideToast() {
        this.toastVisible = false
    }

    // Websocket
    user
    subscription: Subscription

    connect() {
        console.log('connect')
        this.user = {
            id: '5f5cae86-c1c0-11ea-b8db-0ac5bb0044e6',
        }
        this.chatService.connect(this.user)
    }

    disconnect() {
        console.log('disconnect')
        this.chatService.disconnect()
    }

    publish() {
        console.log('publish')
        this.chatService.setMember('112')
    }

    subscribe() {
        console.log('subscribe')
        this.subscription = this.chatService.getMemberList('112').subscribe(
            (v) => {
                console.log(v)
            },
            (error) => {
                console.log(error)
            }
        )
    }
    unsubscribe() {
        console.log('unsubscribe')
        this.subscription.unsubscribe()
    }

    ngOnDestroy() {
        this.chatService.disconnect()
    }
}
