import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Translate
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Components
import { AvatarComponent } from './components/avatar/avatar.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { InputComponent } from './components/input/input.component';
import { ModalComponent } from './components/modal/modal.component';
import { RadioComponent } from './components/radio/radio.component';
import { SelectComponent } from './components/select/select.component';
import { SwitchComponent } from './components/switch/switch.component';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { ToastComponent } from './components/toast/toast.component';

// Directives
import { AutoScrollDirective } from './directives/auto-scroll.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DropzoneDirective } from './directives/dropzone.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { TooltipDirective } from './directives/tooltip.directive';

// Pipes
import { LinkPipe } from './pipes/link.pipe';
import { MinuteSecondsPipe } from './pipes/minuteSeconds.pipe';
import { numberWithCommasPipe } from './pipes/numberWithCommas.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { TimePipe } from './pipes/time.pipe';

// Dragula
import { DragulaModule } from 'ng2-dragula';

// Image Crop
import { ImageCropperModule } from 'ngx-image-cropper';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { FeedSliderComponent } from './components/feed-slider/feed-slider.component';
import { SwiperModule } from 'swiper/angular';
import { FeedCommentModalComponent } from './components/feed-comment-modal/feed-comment-modal.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { ComponentsModule } from '../feature/components/components.module';
import { FollowViewModalComponent } from './components/follow-view-modal/follow-view-modal.component';
import { FeedLikeUserModalComponent } from './components/feed-like-user-modal/feed-like-user-modal.component';
import { FeedDetailModalComponent } from './components/feed-detail-modal/feed-detail-modal.component';
import { TopicSliderComponent } from './components/topic-slider/topic-slider.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    // Components
    AvatarComponent,
    CheckboxComponent,
    DatepickerComponent,
    InputComponent,
    LoginModalComponent,
    ModalComponent,
    RadioComponent,
    SelectComponent,
    SwitchComponent,
    TimepickerComponent,
    ToastComponent,

    // Directives
    AutoScrollDirective,
    ClickOutsideDirective,
    DropzoneDirective,
    HighlightDirective,
    TooltipDirective,

    // Pipes
    LinkPipe,
    MinuteSecondsPipe,
    numberWithCommasPipe,
    SafePipe,
    TimePipe,
    FeedSliderComponent,
    FeedCommentModalComponent,
    FollowViewModalComponent,
    FeedLikeUserModalComponent,
    FeedDetailModalComponent,
    TopicSliderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),

    DragulaModule.forRoot(),
    ImageCropperModule,
    SwiperModule,
    InlineSVGModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,

    // Components
    AvatarComponent,
    CheckboxComponent,
    DatepickerComponent,
    InputComponent,
    LoginModalComponent,
    ModalComponent,
    RadioComponent,
    SelectComponent,
    SwitchComponent,
    TimepickerComponent,
    ToastComponent,

    // Directives
    AutoScrollDirective,
    ClickOutsideDirective,
    DropzoneDirective,
    HighlightDirective,
    TooltipDirective,

    // Pipes
    LinkPipe,
    MinuteSecondsPipe,
    numberWithCommasPipe,
    SafePipe,
    TimePipe,

    // Dragular
    DragulaModule,
    ImageCropperModule,
    LoginModalComponent,
    FeedSliderComponent,
    FeedCommentModalComponent,
    FollowViewModalComponent,
    FeedLikeUserModalComponent,
    FeedDetailModalComponent,
    TopicSliderComponent,
  ],
  providers: [],
})
export class SharedModule {}
