import { ago, DAY } from './time';
import { MockMagazine } from './types';
import { asSeenBy, DEMO_USER, EDITOR } from './users';

const IMG = 'assets/mock/img/magazine';

interface MagazineSeed {
  category: 'news' | 'release' | 'artist';
  ko: string;
  en: string;
  tags: [string, string][];
  views: number;
  image: number; // magazine-NN.svg. 생성기 장면 순서(gen-images.mjs)에 맞춰 제목과 그림을 맞춘다
}

/** 전부 직접 작성한 가짜 매거진 기사 (본문 링크는 '#') */
const SEEDS: MagazineSeed[] = [
  { category: 'news', ko: '여름 한정판 아트토이 라인업 총정리', en: 'Summer limited art toy lineup', tags: [['아트토이', 'art toy'], ['한정판', 'limited']], views: 1820, image: 2 },
  { category: 'release', ko: '디오라마 입문 키트, 이번 주 발매', en: 'Diorama starter kit out this week', tags: [['디오라마', 'diorama'], ['입문', 'beginner']], views: 960, image: 3 },
  { category: 'artist', ko: '커스텀 작가 인터뷰: 붓 대신 에어브러시를 든 이유', en: 'Interview: why this custom artist picked up an airbrush', tags: [['커스텀', 'custom'], ['인터뷰', 'interview']], views: 2410, image: 4 },
  { category: 'news', ko: '브릭 창작 공모전 수상작 모아 보기', en: 'Brick creation contest winners', tags: [['브릭', 'brick'], ['공모전', 'contest']], views: 1340, image: 1 },
  { category: 'release', ko: '대두 소프비 시리즈 2차 예약 오픈', en: 'Big-head sofubi series, round 2 pre-orders', tags: [['소프비', 'sofubi'], ['예약', 'pre-order']], views: 1105, image: 10 },
  { category: 'artist', ko: '디오라마 작가가 말하는 빛과 그림자', en: 'A diorama maker on light and shadow', tags: [['디오라마', 'diorama'], ['작가', 'artist']], views: 870, image: 9 },
  { category: 'news', ko: '피규어 진열장 조명, 이렇게 고르세요', en: 'How to pick lighting for your display case', tags: [['진열장', 'display'], ['조명', 'lighting']], views: 3020, image: 5 },
  { category: 'release', ko: '메카 프라모델 신규 라인업 공개', en: 'New mecha model kit lineup revealed', tags: [['메카', 'mecha'], ['프라모델', 'model kit']], views: 1490, image: 6 },
  { category: 'artist', ko: '패턴에서 시작된 캐릭터, 아트토이 작가 인터뷰', en: 'A character born from a pattern: art toy artist interview', tags: [['아트토이', 'art toy'], ['인터뷰', 'interview']], views: 990, image: 8 },
  { category: 'news', ko: '키덜트 플리마켓 현장 스케치', en: 'Scenes from the kidult flea market', tags: [['플리마켓', 'flea market'], ['현장', 'report']], views: 760, image: 7 },
];

export const MAGAZINES: MockMagazine[] = SEEDS.map((seed, index) => {
  const id = `magazine-${String(index + 1).padStart(2, '0')}`;
  return {
    id,
    writer: EDITOR,
    category: `magazine_category_${seed.category}`,
    ko: { id: `${id}-ko`, magazineId: id, title: seed.ko, body: '#' },
    en: { id: `${id}-en`, magazineId: id, title: seed.en, body: '#' },
    picture: `${IMG}/magazine-${String(seed.image).padStart(2, '0')}.svg`,
    tags: seed.tags.map(([ko, en], i) => ({ id: `${id}-t${i + 1}`, tagId: `mtag-${ko}`, nameKo: ko, nameEn: en, tagCount: 1 })),
    createdAt: ago((index + 1) * 2 * DAY),
    likeCount: Math.round(seed.views / 20),
    isLike: false,
    isBookmark: false,
    viewCount: seed.views,
  };
});

export const TOP_MAGAZINE_IDS = ['magazine-01', 'magazine-03', 'magazine-07'];

/** 데모 사용자가 스크랩(북마크)한 매거진 */
export const DEMO_MAGAZINE_BOOKMARKS = ['magazine-01', 'magazine-03', 'magazine-06', 'magazine-08'];

export function magazineSeenBy(magazine: MockMagazine, viewerId: string | null): MockMagazine {
  return {
    ...magazine,
    writer: asSeenBy(magazine.writer, viewerId),
    isBookmark: viewerId === DEMO_USER.id && DEMO_MAGAZINE_BOOKMARKS.includes(magazine.id),
  };
}
