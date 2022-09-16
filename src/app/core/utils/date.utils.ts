import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  public getTimeStamp(date: string): number {

    let nowDate = new Date();
    let utcNow = nowDate.getTime();
    // let theDate = new Date(Date.parse(date));
    //임시 시간 3달 이후로 변경
    let theDate = new Date(Date.parse(date));
    theDate = new Date(theDate.setMonth(theDate.getMonth()+2));

    const timeStamp = utcNow - theDate.getTime();

    return timeStamp;
  }

  public transTimeType(timeStamp: number): string {
    let timeToDate = new Date(timeStamp);
    let timeToTimeType;
    let returnsTimeString = '';

    let selectLanguage = localStorage.getItem('language');

    if (selectLanguage == 'ko') {
      if (timeStamp < 0) {
        returnsTimeString = '방금 전';
      } else if (timeStamp / 1000 < 60 * 60) {
        timeToTimeType = timeToDate.getUTCMinutes();
        if (timeToTimeType < 5) {
          returnsTimeString = '방금 전';
        } else if (timeToTimeType >= 5 && timeToTimeType < 30) {
          returnsTimeString = timeToTimeType + '분 전';
        } else if (timeToTimeType >= 30 && timeToTimeType < 60) {
          returnsTimeString = Math.floor(timeToTimeType / 10) + '0분 전';
        }
      } else if (timeStamp / 1000 >= 60 * 60 && timeStamp / 1000 < 60 * 60 * 24) {
        timeToTimeType = timeToDate.getUTCHours();
        returnsTimeString = timeToTimeType + '시간 전';
      } else if (timeStamp / 1000 >= 60 * 60 * 24 && timeStamp / 1000 < 60 * 60 * 24 * 30) {
        timeToTimeType = timeToDate.getUTCDate() - 1;
        returnsTimeString = timeToTimeType + '일 전';
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 30 && timeStamp / 1000 < 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCMonth() + 1;
        returnsTimeString = timeToTimeType + '개월 전';
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCFullYear() - 1970;
        returnsTimeString = timeToTimeType + '년 전';
      }
    } else {
      if (timeStamp < 0) {
        returnsTimeString = 'Just now';
      } else if (timeStamp / 1000 < 60 * 60) {
        timeToTimeType = timeToDate.getUTCMinutes();
        if (timeToTimeType < 5) {
          returnsTimeString = 'Just now';
        } else if (timeToTimeType >= 5 && timeToTimeType < 30) {
          returnsTimeString = timeToTimeType + 'minutes ago';
        } else if (timeToTimeType >= 30 && timeToTimeType < 60) {
          returnsTimeString = Math.floor(timeToTimeType / 10) + '0minutes ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 && timeStamp / 1000 < 60 * 60 * 24) {
        timeToTimeType = timeToDate.getUTCHours();
        if (timeToTimeType > 1) {
          returnsTimeString = timeToTimeType + 'hours ago';
        } else {
          returnsTimeString = timeToTimeType + 'hour ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 * 24 && timeStamp / 1000 < 60 * 60 * 24 * 30) {
        timeToTimeType = timeToDate.getUTCDate() - 1;
        if (timeToTimeType > 1) {
          returnsTimeString = timeToTimeType + 'days ago';
        } else {
          returnsTimeString = timeToTimeType + 'day ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 30 && timeStamp / 1000 < 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCMonth() + 1;
        if (timeToTimeType > 1) {
          returnsTimeString = timeToTimeType + 'months ago';
        } else {
          returnsTimeString = timeToTimeType + 'month ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCFullYear() - 1970;
        if (timeToTimeType > 1) {
          returnsTimeString = timeToTimeType + 'years ago';
        } else {
          returnsTimeString = timeToTimeType + 'year ago';
        }
      }
    }

    return returnsTimeString;
  }
}
