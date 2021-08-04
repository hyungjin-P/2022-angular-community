import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment-timezone'

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
    constructor() {}

    transform(value: string) {
        const time = moment(value, 'HH:mm:ss').format('hh/mm/a')
        const timeArr = time.split('/')
        const amPm = timeArr[2] == 'am' ? '오전' : '오후'

        return `${amPm} ${timeArr[0]}:${timeArr[1]}`
    }
}
