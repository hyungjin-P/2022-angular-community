import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SwiperComponent } from 'swiper/angular';
import Swiper, { FreeMode, Navigation, Thumbs } from 'swiper';
import { ImageCroppedEvent } from 'ngx-image-cropper';

Swiper.use([FreeMode, Navigation, Thumbs]);

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TestPageComponent implements OnInit, AfterViewInit {
  /* swiper */
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  thumbsSwiper: any;

  dragSwiper: any;

  /* photo editor */
  imageChangedEvent: any = '';
  croppedImage: any = '';

  /* ui */
  timePeriods = [
    'https://swiperjs.com/demos/images/nature-1.jpg',
    'https://swiperjs.com/demos/images/nature-2.jpg',
    'https://swiperjs.com/demos/images/nature-3.jpg',
    'https://swiperjs.com/demos/images/nature-4.jpg',
    'https://swiperjs.com/demos/images/nature-5.jpg',
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  dropEvent(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  fileChangeEvent(event: Event) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }
}
