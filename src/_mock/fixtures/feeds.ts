import { ago, DAY, feedAgo, HOUR } from './time';
import { MockComment, MockFeed, MockFeedTag } from './types';
import { asSeenBy, DEMO_USER, findUser, mockFile, USERS } from './users';

const IMG = 'assets/mock/img/feed';
const img = (n: number) => `${IMG}/feed-${String(((n - 1) % 24) + 1).padStart(2, '0')}.svg`;

interface FeedSeed {
  writer: number; // USERS 인덱스 + 1
  images: number[];
  minutesAgo: number;
  content: string;
  tags: string[];
  likers: number[];
  baseLikes: number;
}

/** 전부 직접 작성한 가짜 게시글 */
const SEEDS: FeedSeed[] = [
  { writer: 2, images: [1, 7], minutesAgo: 12, content: '새로 맞춘 진열장 첫 줄 완성! 조명 각도 잡는 데만 한 시간 걸렸어요 😂 다음 칸은 어떤 테마로 채울지 고민 중입니다.', tags: ['진열장', '피규어', '컬렉션'], likers: [3, 5, 7], baseLikes: 21 },
  { writer: 4, images: [2, 8], minutesAgo: 47, content: '도색 마무리한 메카 한 기. 먹선은 회색으로 넣어서 너무 튀지 않게 했어요. 관절 가동 범위가 생각보다 넓네요.', tags: ['메카', '도색', '프라모델'], likers: [1, 11], baseLikes: 34 },
  { writer: 3, images: [3, 9, 15], minutesAgo: 2 * HOUR, content: '주말 동안 쌓은 계단식 성벽 🧱 색 배치를 랜덤으로 했더니 오히려 자연스러운 느낌!', tags: ['브릭', '창작', '주말취미'], likers: [1, 2, 10, 11], baseLikes: 18 },
  { writer: 12, images: [4], minutesAgo: 3 * HOUR, content: '점박이 패턴 곰 아트토이 도착했습니다. 실물이 사진보다 훨씬 귀여워요. 패턴이 한 마리도 같은 게 없대요.', tags: ['아트토이', '언박싱'], likers: [5, 9], baseLikes: 42 },
  { writer: 6, images: [5, 11], minutesAgo: 5 * HOUR, content: '작은 마을 디오라마 진행 상황 공유합니다. 나무는 스펀지를 잘라서 만들었고, 지붕은 우드락에 색만 입혔어요.', tags: ['디오라마', '미니어처', 'DIY'], likers: [1, 3, 7], baseLikes: 27 },
  { writer: 5, images: [6, 12], minutesAgo: 8 * HOUR, content: '소프비 신작 대두 피규어! 볼터치 색감이 너무 마음에 들어요. 박스 아트도 예뻐서 버리지 못하는 중…', tags: ['소프비', '피규어'], likers: [12], baseLikes: 15 },
  { writer: 7, images: [13], minutesAgo: 11 * HOUR, content: '자연광 들어올 때 찍은 진열장 사진. 오후 4시가 제일 예쁜 것 같아요. 반사판 대신 흰 종이 한 장이면 충분합니다.', tags: ['토이포토', '진열장', '촬영팁'], likers: [1, 2], baseLikes: 56 },
  { writer: 9, images: [22, 16], minutesAgo: 20 * HOUR, content: '커스텀 의뢰 작업 완료했습니다. 원래 색을 전부 벗기고 새로 칠했어요. 의뢰인분이 좋아해 주셔서 뿌듯합니다.', tags: ['커스텀', '도색', '작가'], likers: [1, 4, 6, 12], baseLikes: 63 },
  { writer: 1, images: [16], minutesAgo: 1 * DAY + 2 * HOUR, content: '처음 올려 보는 내 컬렉션 🙌 아직 한 칸뿐이지만 조금씩 채워 갈게요.', tags: ['첫게시글', '컬렉션'], likers: [2, 3, 9], baseLikes: 9 },
  { writer: 10, images: [14, 20], minutesAgo: 1 * DAY + 6 * HOUR, content: '입문용으로 메카 하나 조립해 봤는데 니퍼 하나로 이렇게 달라지네요. 추천해 주신 분들 감사합니다!', tags: ['입문', '메카', '조립'], likers: [4, 11], baseLikes: 12 },
  { writer: 11, images: [21], minutesAgo: 2 * DAY, content: '퇴근 후 30분씩 쌓은 브릭 피라미드. 일주일 걸렸습니다.', tags: ['브릭', '주말취미'], likers: [3], baseLikes: 19 },
  { writer: 8, images: [24, 6], minutesAgo: 2 * DAY + 5 * HOUR, content: '창고 정리하다 나온 옛날 완구들. 상자 색이 바래도 정겨운 건 그대로네요.', tags: ['레트로', '완구', '추억'], likers: [1, 2, 7], baseLikes: 38 },
  { writer: 2, images: [19], minutesAgo: 3 * DAY, content: '진열장 두 번째 칸은 파스텔 톤으로 맞춰 봤어요. 배경지를 바꾸니 분위기가 완전히 달라집니다.', tags: ['진열장', '파스텔'], likers: [5, 7, 12], baseLikes: 29 },
  { writer: 6, images: [23, 17], minutesAgo: 3 * DAY + 4 * HOUR, content: '디오라마용 미니 피규어 배치 테스트. 사람 하나만 들어가도 이야기가 생기네요.', tags: ['디오라마', '미니어처'], likers: [1, 9], baseLikes: 24 },
  { writer: 4, images: [8], minutesAgo: 4 * DAY, content: '웨더링 연습작. 녹 표현은 갈색과 주황을 겹쳐서 찍어 줬어요.', tags: ['메카', '웨더링', '도색'], likers: [10], baseLikes: 31 },
  { writer: 12, images: [10], minutesAgo: 5 * DAY, content: '보라색 곰 시리즈 모으는 중. 한 마리만 더 모으면 컬러 라인업 완성!', tags: ['아트토이', '컬렉션'], likers: [1, 5], baseLikes: 47 },
  { writer: 5, images: [12], minutesAgo: 6 * DAY, content: '소프비 볼터치 비교샷. 같은 틀인데 도색에 따라 표정이 달라 보여요.', tags: ['소프비', '비교'], likers: [], baseLikes: 11 },
  { writer: 3, images: [9], minutesAgo: 7 * DAY, content: '남은 브릭으로 만든 작은 계단. 버리는 조각 없이 다 썼습니다.', tags: ['브릭', '창작'], likers: [11], baseLikes: 14 },
  { writer: 9, images: [18], minutesAgo: 9 * DAY, content: '커스텀 전후 비교. 피부 톤을 세 번 다시 칠했어요.', tags: ['커스텀', '작가'], likers: [1, 6], baseLikes: 52 },
  { writer: 1, images: [11], minutesAgo: 10 * DAY, content: '디오라마 따라 만들기 1일 차. 공방님 게시글 보고 용기 냈어요!', tags: ['디오라마', '따라하기'], likers: [6], baseLikes: 7 },
  { writer: 7, images: [1], minutesAgo: 12 * DAY, content: '역광으로 찍으면 실루엣이 살아나요. 피규어 사진 찍을 때 한 번 시도해 보세요.', tags: ['토이포토', '촬영팁'], likers: [2, 3], baseLikes: 44 },
  { writer: 11, images: [15], minutesAgo: 14 * DAY, content: '첫 브릭 작품. 설명서 없이 만들어 본 건 처음이라 삐뚤빼뚤하지만 애착이 갑니다.', tags: ['브릭', '입문'], likers: [], baseLikes: 6 },
  { writer: 8, images: [20], minutesAgo: 20 * DAY, content: '레트로 로봇 완구 복원 완료. 태엽이 다시 돌아갑니다!', tags: ['레트로', '복원'], likers: [4], baseLikes: 39 },
  { writer: 10, images: [6], minutesAgo: 30 * DAY, content: '생애 첫 피규어 구매 기념 📦 앞으로 잘 부탁드려요.', tags: ['입문', '피규어'], likers: [1, 2, 5], baseLikes: 16 },
];

const TAG_IDS = new Map<string, string>();
function tag(name: string): MockFeedTag {
  if (!TAG_IDS.has(name)) {
    TAG_IDS.set(name, `tag-${TAG_IDS.size + 1}`);
  }
  return { id: TAG_IDS.get(name) as string, name, tagCount: 0 };
}

const COMMENT_POOL = [
  '와 색감 너무 예뻐요!',
  '이건 어디서 구하셨어요?',
  '조명 세팅 공유해 주실 수 있나요?',
  '저도 비슷한 거 모으는데 반갑네요 😊',
  '디테일 장난 아니네요…',
  '다음 작품도 기대할게요!',
  '사진 구도가 정말 좋아요.',
  '저장해 두고 참고하겠습니다.',
];

function buildComments(feedId: string, feedIndex: number, writerId: string): MockComment[] {
  const count = feedIndex % 4 === 3 ? 0 : 1 + (feedIndex % 3);
  const comments: MockComment[] = [];
  for (let i = 0; i < count; i++) {
    const author = USERS[(feedIndex + i * 3 + 1) % USERS.length];
    const parentId = `${feedId}-c${i + 1}`;
    comments.push({
      id: parentId,
      feedId,
      parentId: null,
      writer: author,
      text: COMMENT_POOL[(feedIndex + i) % COMMENT_POOL.length],
      mentions: [],
      likes: i === 0 ? [{ userId: DEMO_USER.id }] : [],
      likeCount: i === 0 ? 1 : 0,
      sub_comment_count: i === 0 ? 1 : 0,
      deletedAt: null,
      createdAt: ago(90 - i * 20),
      updatedAt: ago(90 - i * 20),
    });
    if (i === 0) {
      const writer = findUser(writerId) ?? author;
      comments.push({
        id: `${parentId}-r1`,
        feedId,
        parentId,
        writer,
        text: '감사합니다! 천천히 공유해 볼게요 🙏',
        mentions: [{ id: `${parentId}-m1`, feedCommentId: `${parentId}-r1`, mentionUser: author }],
        likes: [],
        likeCount: 0,
        sub_comment_count: 0,
        deletedAt: null,
        createdAt: ago(40),
        updatedAt: ago(40),
      });
    }
  }
  return comments;
}

interface FeedRecord {
  feed: MockFeed;
  likerIds: string[];
  baseLikes: number;
  comments: MockComment[];
}

export const FEEDS: FeedRecord[] = SEEDS.map((seed, index) => {
  const id = `feed-${String(index + 1).padStart(2, '0')}`;
  const writer = USERS[seed.writer - 1];
  const pictures = seed.images.map((n, i) => mockFile(`${id}-p${i + 1}`, img(n)));
  const comments = buildComments(id, index, writer.id);
  return {
    likerIds: seed.likers.map((n) => USERS[n - 1].id),
    baseLikes: seed.baseLikes,
    comments,
    feed: {
      id,
      writer,
      content: seed.content,
      picture: pictures[0].url,
      pictures,
      tags: seed.tags.map(tag),
      uploadedAt: feedAgo(seed.minutesAgo),
      createdAt: feedAgo(seed.minutesAgo),
      likeUsers: [],
      likeCount: 0,
      commentCount: comments.length,
      pictureCount: pictures.length,
      isLike: false,
      isBookmark: false,
    },
  };
});

/** 데모 사용자가 스크랩(북마크)한 피드 */
export const DEMO_FEED_BOOKMARKS = ['feed-01', 'feed-03', 'feed-05', 'feed-08', 'feed-12', 'feed-14', 'feed-19'];

/** viewer 기준 isLike·isBookmark·likeUsers·writer.isFollow 를 채운 사본 */
export function feedSeenBy(record: FeedRecord, viewerId: string | null): MockFeed {
  const likeUsers = record.likerIds.map((userId) => ({
    feedId: record.feed.id,
    userId,
    user: asSeenBy(findUser(userId) ?? USERS[0], viewerId),
    createdAt: ago(30),
  }));
  return {
    ...record.feed,
    writer: asSeenBy(record.feed.writer, viewerId),
    likeUsers,
    likeCount: record.baseLikes + record.likerIds.length,
    isLike: viewerId !== null && record.likerIds.includes(viewerId),
    isBookmark: viewerId === DEMO_USER.id && DEMO_FEED_BOOKMARKS.includes(record.feed.id),
  };
}

export function findFeed(id: string | null): FeedRecord | undefined {
  return FEEDS.find((r) => r.feed.id === id);
}

export function allTags(): MockFeedTag[] {
  const counts = new Map<string, number>();
  FEEDS.forEach((r) => r.feed.tags.forEach((t) => counts.set(t.name, (counts.get(t.name) ?? 0) + 1)));
  return [...counts.entries()].map(([name, tagCount]) => ({ ...tag(name), tagCount }));
}
