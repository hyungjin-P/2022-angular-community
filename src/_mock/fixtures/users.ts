import { MockFile, MockUser } from './types';

const IMG = 'assets/mock/img';

export function mockFile(id: string, url: string): MockFile {
  return { id, url, originalname: url.split('/').pop() ?? id, mimetype: 'image/svg+xml', size: 4096 };
}

function user(no: number, nickname: string, aboutMe: string): MockUser {
  const id = `user-${String(no).padStart(2, '0')}`;
  return {
    id,
    provider: 'email',
    name: nickname,
    nickname,
    email: `${id}@example.com`,
    aboutMe,
    picture: [mockFile(`${id}-picture`, `${IMG}/avatar/avatar-${String(((no - 1) % 12) + 1).padStart(2, '0')}.svg`)],
    background: [],
    agreementAge: true,
    agreementPrivacy: true,
    agreementServiceTerms: true,
    agreementMarketing: false,
    signUpType: 'email',
    isFollow: false,
  };
}

/** 전부 지어낸 가짜 사용자. 실제 키핑 회원과 무관하다. */
export const USERS: MockUser[] = [
  user(1, '키핑데모', '포트폴리오 데모 계정입니다. 피규어와 브릭을 좋아해요.'),
  user(2, '선반위의우주', '진열장 하나에 우주 하나.'),
  user(3, '브릭쌓는곰', '주말마다 브릭으로 성을 쌓습니다.'),
  user(4, '메카정비사', '먹선과 웨더링에 진심인 편.'),
  user(5, '소프비수집가', '대두 소프비만 모읍니다.'),
  user(6, '디오라마공방', '손바닥만 한 세상을 만들어요.'),
  user(7, '토이포토그래퍼', '자연광 토이 사진.'),
  user(8, '레트로완구점', '80~90년대 완구 아카이브.'),
  user(9, '커스텀작가_윤슬', '커스텀 의뢰 받습니다.'),
  user(10, '피규어초보', '입문 3개월 차, 추천 환영!'),
  user(11, '주말의조립', '평일엔 회사원, 주말엔 조립러.'),
  user(12, '아트토이러버', '패턴 있는 아트토이 수집.'),
];

export const EDITOR: MockUser = {
  ...user(13, '키핑 매거진', '키핑 매거진 에디터'),
  email: 'magazine@example.com',
};

export const DEMO_USER = USERS[0];

/** 데모 사용자가 팔로우하는 사용자 */
export const DEMO_FOLLOWING = ['user-02', 'user-03', 'user-04', 'user-06', 'user-09', 'user-12'];

/** 데모 사용자를 팔로우하는 사용자 */
export const DEMO_FOLLOWERS = ['user-02', 'user-05', 'user-07', 'user-09', 'user-10', 'user-11'];

export function findUser(id: string | null): MockUser | undefined {
  return [...USERS, EDITOR].find((u) => u.id === id);
}

/** viewer 기준 isFollow 를 채운 사본 */
export function asSeenBy(target: MockUser, viewerId: string | null): MockUser {
  return { ...target, isFollow: viewerId === DEMO_USER.id && DEMO_FOLLOWING.includes(target.id) };
}
