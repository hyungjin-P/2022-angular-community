import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import Swiper, { Navigation, Pagination, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

Swiper.use([Navigation]);

@Component({
  selector: 'app-feed-slider',
  templateUrl: './feed-slider.component.html',
  styleUrls: ['./feed-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedSliderComponent implements OnInit, AfterViewInit {
  @Input() pictures: any[] = [];

  @Input() isLike: boolean = false;

  @Input() isBookmark: boolean = false;

  @Input() disabledLikeButton: boolean = false;

  @Input() disabledBookmarkButton: boolean = false;

  @Output() onClickPicture = new EventEmitter();

  @Output() activeIndex = new EventEmitter();

  @Output() onChangeSlide = new EventEmitter();

  @Output() onClickLike = new EventEmitter();

  @Output() onClickBookmark = new EventEmitter();

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  activeNumber: number = 1;

  swiperOptions: SwiperOptions = {
    navigation: true,
    // loop: true,
    // loopedSlides: 1,
    // pagination: { clickable: true },
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // 슬라이드 변경 시
    this.swiper.swiperRef.on('slideChange', (swiper) => {
      this.setActiveNumber(swiper.realIndex + 1);
      this.onChangeSlideEvent(swiper);
    });
  }

  ngOnInit(): void {}

  onChangeSlideEvent(swiper: Swiper): void {
    this.onChangeSlide.emit({ swiper });
  }

  onClickPictureEvent(picture: any): void {
    this.onClickPicture.emit({ picture });
  }

  setActiveNumber(indexNumber: number): void {
    this.activeNumber = indexNumber;
    this.changeDetectorRef.detectChanges();
    this.activeIndex.emit({ activeIndex: this.activeNumber });
  }

  onClickLikeEvent(event: any): void {
    this.onClickLike.emit({ event });
  }

  onClickBookmarkEvent(event: any): void {
    this.onClickBookmark.emit({ event });
  }
}
