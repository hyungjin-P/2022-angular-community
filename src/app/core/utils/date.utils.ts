import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  public getTimeStamp(date: string): number {
    let nowDate = new Date();
    let utcNow = nowDate.getTime() + nowDate.getTimezoneOffset() * 60 * 1000;
    let theDate = new Date(Date.parse(date));
    let timeStamp = utcNow - theDate.getTime();

    return timeStamp;
  }

  public transTimeType(timeStamp: number): string {
    let timeToDate = new Date(timeStamp);
    let timeToTimeType;
    let retunsTimeString = '';

    let selectLanguage = localStorage.getItem('language');

    if (selectLanguage == 'ko') {
      if (timeStamp / 1000 < 60 * 60) {
        timeToTimeType = timeToDate.getUTCMinutes();
        if (timeToTimeType < 5) {
          retunsTimeString = '방금 전';
        } else if (timeToTimeType >= 5 && timeToTimeType < 30) {
          retunsTimeString = timeToTimeType + '분 전';
        } else if (timeToTimeType >= 30 && timeToTimeType < 60) {
          retunsTimeString = Math.floor(timeToTimeType / 10) + '0분 전';
        }
      } else if (timeStamp / 1000 >= 60 * 60 && timeStamp / 1000 < 60 * 60 * 24) {
        timeToTimeType = timeToDate.getUTCHours();
        retunsTimeString = timeToTimeType + '시간 전';
      } else if (timeStamp / 1000 >= 60 * 60 * 24 && timeStamp / 1000 < 60 * 60 * 24 * 30) {
        timeToTimeType = timeToDate.getUTCDate() - 1;
        retunsTimeString = timeToTimeType + '일 전';
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 30 && timeStamp / 1000 < 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCMonth() + 1;
        retunsTimeString = timeToTimeType + '개월 전';
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCFullYear() - 1970;
        retunsTimeString = timeToTimeType + '년 전';
      }
    } else {
      if (timeStamp / 1000 < 60 * 60) {
        timeToTimeType = timeToDate.getUTCMinutes();
        if (timeToTimeType < 5) {
          retunsTimeString = 'Just now';
        } else if (timeToTimeType >= 5 && timeToTimeType < 30) {
          retunsTimeString = timeToTimeType + 'minutes ago';
        } else if (timeToTimeType >= 30 && timeToTimeType < 60) {
          retunsTimeString = Math.floor(timeToTimeType / 10) + '0minutes ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 && timeStamp / 1000 < 60 * 60 * 24) {
        timeToTimeType = timeToDate.getUTCHours();
        if (timeToTimeType > 1) {
          retunsTimeString = timeToTimeType + 'hours ago';
        } else {
          retunsTimeString = timeToTimeType + 'hour ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 * 24 && timeStamp / 1000 < 60 * 60 * 24 * 30) {
        timeToTimeType = timeToDate.getUTCDate() - 1;
        if (timeToTimeType > 1) {
          retunsTimeString = timeToTimeType + 'days ago';
        } else {
          retunsTimeString = timeToTimeType + 'day ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 30 && timeStamp / 1000 < 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCMonth() + 1;
        if (timeToTimeType > 1) {
          retunsTimeString = timeToTimeType + 'months ago';
        } else {
          retunsTimeString = timeToTimeType + 'month ago';
        }
      } else if (timeStamp / 1000 >= 60 * 60 * 24 * 365) {
        timeToTimeType = timeToDate.getUTCFullYear() - 1970;
        if (timeToTimeType > 1) {
          retunsTimeString = timeToTimeType + 'years ago';
        } else {
          retunsTimeString = timeToTimeType + 'year ago';
        }
      }
    }

    return retunsTimeString;
  }
}
