import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation,} from '@angular/core';

import Swiper, {Mousewheel, Navigation, SwiperOptions} from 'swiper';

Swiper.use([Navigation, Mousewheel]);

@Component({
  selector: 'app-topic-slider',
  templateUrl: './topic-slider.component.html',
  styleUrls: ['./topic-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopicSliderComponent implements OnInit {

  swiperOptions: SwiperOptions = {
    navigation: true,
  };

  selectOption: string = 'new';

  language: string;

  @Input() topics: any[] = [];

  @Output() chooseTopic = new EventEmitter<any>();

  @Output() changeSelectedOption = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    this.language = localStorage.getItem('language');
  }

  chooseTopicEmit(topic: any): void {
    this.chooseTopic.emit(topic);
  }

  changeSelectedOptions(): void {
    this.selectOption = this.selectOption === 'new' ? 'popular' : 'new';
    this.changeSelectedOption.emit({selectedOption: this.selectOption});
  }

}
