import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TextService {
  language: string;

  private text = {
    ko: {
      'auth:email:001': '규칙에 맞는 이메일 주소를 입력해 주세요.',
      'auth:email:002': '이미 가입된 이메일 주소 입니다.',
      'auth:email:003': '인증번호가 일치하지 않습니다. 다시 입력해주세요.',
      'auth:email:004': '인증번호 입력시간이 초과되었습니다.',
      'auth:email:005': '비밀번호에 공백을 제외하고 입력해주세요.',
      'auth:email:006': '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.',
      'auth:email:007': '비밀번호가 일치하지 않습니다.',

      'auth:forgot-password:001': '비밀번호 재설정 링크를 발송하였습니다.',
      'auth:forgot-password:002': '확인',
      'auth:forgot-password:003': '규칙에 맞는 이메일 주소를 입력해 주세요.',

      'auth:login:001': '규칙에 맞는 이메일 주소를 입력해 주세요.',
      'auth:login:002': '비밀번호에 공백을 제외하고 입력해주세요.',
      'auth:login:003': '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.',

      'auth:reset-password:001': '만료된 비밀번호 재설정 링크입니다.',
      'auth:reset-password:002': '비밀번호 변경이 완료되었습니다.',
      'auth:reset-password:003': '확인',
      'auth:reset-password:004': '비밀번호에 공백을 제외하고 입력해주세요.',
      'auth:reset-password:005': '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.',
      'auth:reset-password:006': '비밀번호가 일치하지 않습니다.',

      'auth.registration-001': '회원가입 중 오류가 발생했습니다.',

      'settings:profile:001': '최대 200자까지 간단 소개글을 입력해 주세요.',
      'settings:profile:002': '사용가능한 닉네임입니다.',
      'settings:profile:003': '사용중인 닉네임입니다.',
      'settings:profile:004': '닉네임을 입력해주세요.',
      'settings:profile:005': '프로필이 수정되었습니다.',

      'settings:change-password:001': '비밀번호에 공백을 제외하고 입력해주세요.',
      'settings:change-password:002': '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.',
      'settings:change-password:003': '기존 비밀번호가 일치하지 않습니다.',
      'settings:change-password:004': '비밀번호가 변경되었습니다.',

      'write:feed:001': '메인 사진을 선택하세요',
      'write:feed:002': '내용을 작성하세요.',
      'write:feed:003': '등록하였습니다.',
      'write:feed:004': '태그는 최대 10개까지 등록 가능해요',
      'write:feed:005': '수정되었습니다.',

      'follow:001': '팔로우 하였습니다.',
      'follow:002': '팔로우 해제되었습니다.',
    },
    en: {
      'auth:email:001': 'Invalid email address.',
      'auth:email:002': 'This is an already registered email address.',
      'auth:email:003': 'The verification code does not match.',
      'auth:email:004': 'The time to enter the verification code has expired.',
      'auth:email:005': 'Spaces are not allowed.',
      'auth:email:006': 'Password must be at least 8 characters and contain English + numbers.',
      'auth:email:007': 'Passwords do not match.',

      'auth:forgot-password:001': 'We have sent you a password reset link.',
      'auth:forgot-password:002': 'Confirm',
      'auth:forgot-password:003': 'Invalid email address.',

      'auth:login:001': 'Invalid email address.',
      'auth:login:002': 'Spaces are not allowed.',
      'auth:login:003': 'Password must be at least 8 characters and contain English + numbers.',

      'auth:reset-password:001': 'This is an expired link.',
      'auth:reset-password:002': 'You have changed your password.',
      'auth:reset-password:003': 'Confirm',
      'auth:reset-password:004': 'Spaces are not allowed.',
      'auth:reset-password:005': 'Password must be at least 8 characters and contain English + numbers.',
      'auth:reset-password:006': 'Passwords do not match.',

      'auth.registration-001': 'Sorry. Signup failed',

      'settings:profile:001': 'Please enter a brief introduction of up to 200 characters.',
      'settings:profile:002': 'Available nickname.',
      'settings:profile:003': 'This nickname is already using.',
      'settings:profile:004': 'Please enter your nickname.',
      'settings:profile:005': 'Your profile has been modified.',

      'settings:change-password:001': 'Spaces are not allowed.',
      'settings:change-password:002': 'Password must be at least 8 characters and contain English + numbers.',
      'settings:change-password:003': 'Existing passwords do not match.',
      'settings:change-password:004': 'Your password has been changed.',

      'write:feed:001': 'Choose your main picture',
      'write:feed:002': 'Please write your content.',
      'write:feed:003': 'Posted.',
      'write:feed:004': 'You can register up to 10 tags.',
      'write:feed:005': 'Update Complete.',

      'follow:001': 'Followed it.',
      'follow:002': 'Unfollowed it.',
    },
  };

  constructor() {
    this.language = localStorage.getItem('language');
  }

  changeLanguage(language: string) {
    this.language = language;
  }

  getText(code: string, defaultText?: string) {
    return this.text[this.language][code] || defaultText;
  }
}
