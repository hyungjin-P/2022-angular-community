import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { StorageService } from '@services/storage.service';

import { allTags, DEMO_FEED_BOOKMARKS, FEEDS, feedSeenBy, findFeed } from './fixtures/feeds';
import { DEMO_MAGAZINE_BOOKMARKS, MAGAZINES, magazineSeenBy, TOP_MAGAZINE_IDS } from './fixtures/magazines';
import { paginate } from './fixtures/paginate';
import { ago, feedAgo } from './fixtures/time';
import { MockComment, MockFeed, MockFile, MockMagazine } from './fixtures/types';
import { asSeenBy, DEMO_FOLLOWERS, DEMO_FOLLOWING, DEMO_USER, findUser, mockFile, USERS } from './fixtures/users';

interface Ctx {
  params: URLSearchParams;
  body: Record<string, unknown>;
  rawBody: unknown;
  viewer: string | null;
}

class MockError {
  constructor(public status: number, public code: string, public message: string) {}
}

type Handler = (ctx: Ctx) => unknown;

const OK = {};
const LATENCY_MS = 120;

function toggle(list: string[], value: string, on: boolean): void {
  const i = list.indexOf(value);
  if (on && i === -1) list.push(value);
  if (!on && i !== -1) list.splice(i, 1);
}

// 글쓰기: createFeed 로 만든 임시 게시글은 posting 전까지 목록에 보이지 않는다
const POSTED_DRAFTS = new Set<string>();
let draftSeq = 0;

function isPosted(f: MockFeed): boolean {
  return !f.id.startsWith('draft-') || POSTED_DRAFTS.has(f.id);
}

function feedsSeenBy(viewer: string | null, filter: (f: MockFeed) => boolean = () => true): MockFeed[] {
  return FEEDS.map((r) => feedSeenBy(r, viewer)).filter((f) => isPosted(f) && filter(f));
}

function feedList(ctx: Ctx) {
  return paginate(feedsSeenBy(ctx.viewer), ctx.params);
}

function feedById(ctx: Ctx) {
  const record = findFeed(ctx.params.get('feedId'));
  return record ? [feedSeenBy(record, ctx.viewer)] : [];
}

function likeList(ctx: Ctx) {
  const record = findFeed(ctx.params.get('feedId'));
  return paginate(record ? feedSeenBy(record, ctx.viewer).likeUsers : [], ctx.params);
}

function magazineList(ctx: Ctx) {
  const category = ctx.params.get('category');
  const list = MAGAZINES.filter((m) => !category || category === 'all' || m.category === category);
  return paginate(list.map((m) => magazineSeenBy(m, ctx.viewer)), ctx.params);
}

function topMagazines(ctx: Ctx) {
  return MAGAZINES.filter((m) => TOP_MAGAZINE_IDS.includes(m.id)).map((m) => magazineSeenBy(m, ctx.viewer));
}

function tagSearch(ctx: Ctx) {
  const q = (ctx.params.get('name') ?? '').trim();
  return q ? allTags().filter((t) => t.name.includes(q)) : [];
}

function followList(ctx: Ctx, ids: string[]) {
  const users = ids.map((id) => findUser(id)).filter((u) => !!u).map((u) => asSeenBy(u, ctx.viewer));
  const page = paginate(users, ctx.params);
  return { users: page.items, metaInfo: { meta: page.meta, links: page.links } };
}

function followingOf(userId: string | null): string[] {
  if (userId === DEMO_USER.id) return DEMO_FOLLOWING;
  return USERS.filter((u) => u.id !== userId).slice(0, 4).map((u) => u.id);
}

function followersOf(userId: string | null): string[] {
  if (userId === DEMO_USER.id) return DEMO_FOLLOWERS;
  return USERS.filter((u) => u.id !== userId).slice(4, 9).map((u) => u.id);
}

function createDraft(ctx: Ctx): MockFeed {
  draftSeq += 1;
  const writer = findUser(ctx.params.get('userId')) ?? DEMO_USER;
  const id = `draft-${draftSeq}`;
  FEEDS.unshift({
    likerIds: [],
    baseLikes: 0,
    comments: [],
    feed: {
      id,
      writer,
      content: '',
      picture: '',
      pictures: [],
      tags: [],
      uploadedAt: feedAgo(0),
      createdAt: feedAgo(0),
      likeUsers: [],
      likeCount: 0,
      commentCount: 0,
      pictureCount: 0,
      isLike: false,
      isBookmark: false,
    },
  });
  return { ...FEEDS[0].feed, pictures: [], tags: [] };
}

function updateFeed(ctx: Ctx) {
  const record = findFeed(String(ctx.body.feedId ?? ''));
  if (!record) return new MockError(404, 'failure:not-found', 'feed not found');
  if (typeof ctx.body.picture === 'string') record.feed.picture = ctx.body.picture;
  if (typeof ctx.body.content === 'string') record.feed.content = ctx.body.content;
  if (ctx.body.posting === true) {
    POSTED_DRAFTS.add(record.feed.id);
    record.feed.uploadedAt = feedAgo(0);
    record.feed.pictureCount = record.feed.pictures.length;
  }
  return record.feed;
}

function modifyFeed(ctx: Ctx) {
  const record = findFeed(String(ctx.body.id ?? ''));
  if (!record) return new MockError(404, 'failure:not-found', 'feed not found');
  const body = ctx.body as Partial<MockFeed>;
  Object.assign(record.feed, {
    content: body.content ?? record.feed.content,
    picture: body.picture ?? record.feed.picture,
    pictures: body.pictures ?? record.feed.pictures,
    tags: body.tags ?? record.feed.tags,
  });
  record.feed.pictureCount = record.feed.pictures.length;
  return OK;
}

function uploadFiles(ctx: Ctx): MockFile[] {
  const form = ctx.rawBody instanceof FormData ? ctx.rawBody : null;
  const files = form ? (form.getAll('files') as File[]) : [];
  const created = files.map((file, i) => ({ ...mockFile(`upload-${Date.now()}-${i}`, URL.createObjectURL(file)), originalname: file.name, mimetype: file.type, size: file.size }));
  const record = findFeed(form ? String(form.get('tagInId') ?? '') : null);
  if (record) record.feed.pictures = [...created, ...record.feed.pictures];
  return created;
}

function addTag(ctx: Ctx) {
  const record = findFeed(ctx.params.get('feedId'));
  const name = ctx.params.get('name') ?? '';
  const created = { id: `tag-new-${Date.now()}`, name, tagCount: 1 };
  if (record) record.feed.tags.push(created);
  return created;
}

function commentsOf(ctx: Ctx): MockComment[] {
  return findFeed(ctx.params.get('feedId'))?.comments ?? [];
}

function createComment(ctx: Ctx): MockComment | MockError {
  const record = findFeed(String(ctx.body.feedId ?? ''));
  const writer = findUser(String(ctx.body.userId ?? ''));
  if (!record || !writer) return new MockError(400, 'failure:invalid', 'invalid comment');
  const comment: MockComment = {
    id: `${record.feed.id}-c${Date.now()}`,
    feedId: record.feed.id,
    parentId: typeof ctx.body.parentId === 'string' ? ctx.body.parentId : null,
    writer,
    text: String(ctx.body.text ?? ''),
    mentions: [],
    likes: [],
    likeCount: 0,
    sub_comment_count: 0,
    deletedAt: null,
    createdAt: ago(0),
    updatedAt: ago(0),
  };
  record.comments.push(comment);
  record.feed.commentCount = record.comments.length;
  return comment;
}

function findComment(id: string | null): { list: MockComment[]; comment: MockComment } | undefined {
  for (const r of FEEDS) {
    const comment = r.comments.find((c) => c.id === id);
    if (comment) return { list: r.comments, comment };
  }
  return undefined;
}

function addMention(ctx: Ctx) {
  const found = findComment(String(ctx.body.feedCommentId ?? ''));
  const mentionUser = findUser(String(ctx.body.mentionUserId ?? ''));
  if (found && mentionUser) {
    found.comment.mentions.push({ id: `${found.comment.id}-m`, feedCommentId: found.comment.id, mentionUser });
  }
  return OK;
}

function commentLike(ctx: Ctx, on: boolean) {
  const found = findComment(ctx.params.get('feedCommentId'));
  const userId = ctx.params.get('userId');
  if (found && userId) {
    found.comment.likes = found.comment.likes.filter((l) => l.userId !== userId);
    if (on) found.comment.likes.push({ userId });
    found.comment.likeCount = found.comment.likes.length;
  }
  return OK;
}

/** 'METHOD /path' → handler. 경로는 environment.userApiAddress 뒤 부분 */
const ROUTES: Record<string, Handler> = {
  // 피드
  'GET /public/feed/findPages': feedList,
  'GET /feed/findPages': feedList,
  'GET /public/feed/findById': feedById,
  'GET /feed/findById': feedById,
  'GET /public/feed/findPagesUnderDate': (ctx) => paginate(feedsSeenBy(null, (f) => f.id !== ctx.params.get('feedId')), ctx.params),
  'GET /public/feed/like/findPages': likeList,
  'GET /feed/like/findPages': likeList,
  'GET /feed/findPagesOverFollow': (ctx) => paginate(feedsSeenBy(ctx.viewer, (f) => followingOf(ctx.viewer).includes(f.writer.id)), ctx.params),
  'GET /feed/findPagesOverBookmark': (ctx) =>
    paginate(
      feedsSeenBy(ctx.viewer, (f) => DEMO_FEED_BOOKMARKS.includes(f.id)).map((feed, i) => ({ id: `fb-${feed.id}`, createdAt: ago(i * 60), feed })),
      ctx.params,
    ),
  'GET /feed/findMypageFeed': (ctx) => {
    const list = feedsSeenBy(ctx.viewer, (f) => f.writer.id === ctx.params.get('userId'));
    return paginate(list, ctx.params, { otherCount: list.length });
  },
  'GET /feed/comment/getFeedCommentsWithRelations': commentsOf,
  'GET /public/feed/findTagList': tagSearch,
  'GET /tag/findTagList': tagSearch,
  'POST /feed/addLike': (ctx) => {
    const record = findFeed(String(ctx.body.feedId ?? ''));
    if (record) toggle(record.likerIds, String(ctx.body.userId ?? ''), true);
    return OK;
  },
  'DELETE /feed/deleteLike': (ctx) => {
    const record = findFeed(ctx.params.get('feedId'));
    if (record) toggle(record.likerIds, ctx.params.get('userId') ?? '', false);
    return OK;
  },
  'POST /feed/addBookmark': (ctx) => (toggle(DEMO_FEED_BOOKMARKS, String(ctx.body.feedId ?? ''), true), OK),
  'DELETE /feed/deleteBookmark': (ctx) => (toggle(DEMO_FEED_BOOKMARKS, ctx.params.get('feedId') ?? '', false), OK),
  'DELETE /feed/deleteAllBookmarkByUserId': () => (DEMO_FEED_BOOKMARKS.splice(0), OK),

  // 글쓰기
  'POST /feed/createFeed': createDraft,
  'POST /feed/updateFeed': updateFeed,
  'POST /feed/modifyFeed': modifyFeed,
  'POST /feed/modifyFeedPicture': modifyFeed,
  'POST /feed/addFeedTagNameOnly': addTag,
  'DELETE /feed/deleteFeedTagNameOnly': (ctx) => {
    const record = findFeed(ctx.params.get('feedId'));
    if (record) record.feed.tags = record.feed.tags.filter((t) => t.id !== ctx.params.get('tagId'));
    return OK;
  },
  'DELETE /feed/deleteFeed': (ctx) => {
    const i = FEEDS.findIndex((r) => r.feed.id === ctx.params.get('feedId'));
    if (i !== -1) FEEDS.splice(i, 1);
    return OK;
  },
  'POST /file': uploadFiles,
  'DELETE /file': (ctx) => {
    const record = findFeed(ctx.params.get('tagInId'));
    if (record) record.feed.pictures = record.feed.pictures.filter((p) => p.url !== ctx.params.get('url'));
    return OK;
  },

  // 댓글
  'POST /feed/comment/create': createComment,
  'POST /feed/comment/addMention': addMention,
  'POST /feed/comment/modify': (ctx) => {
    const found = findComment(ctx.params.get('feedCommentId'));
    if (found) found.comment.text = ctx.params.get('text') ?? found.comment.text;
    return OK;
  },
  'DELETE /feed/comment/remove': (ctx) => {
    const found = findComment(ctx.params.get('feedCommentId'));
    if (found) found.list.splice(found.list.indexOf(found.comment), 1);
    return OK;
  },
  'POST /feed/comment/addLike': (ctx) => commentLike(ctx, true),
  'DELETE /feed/comment/deleteLike': (ctx) => commentLike(ctx, false),

  // 매거진
  'GET /public/magazine/findTopMagazineList': topMagazines,
  'GET /magazine/findTopMagazineList': topMagazines,
  'GET /public/magazine/findPages': magazineList,
  'GET /magazine/findPages': magazineList,
  'GET /public/magazine/findTagList': (ctx) => {
    const q = ctx.params.get('name') ?? '';
    return MAGAZINES.reduce((tags, m) => tags.concat(m.tags), [] as MockMagazine['tags']).filter((t) => q && t.nameKo.includes(q));
  },
  'GET /magazine/findPagesOverBookmark': (ctx) =>
    paginate(
      MAGAZINES.filter((m) => DEMO_MAGAZINE_BOOKMARKS.includes(m.id)).map((m, i) => ({ id: `mb-${m.id}`, createdAt: ago(i * 60), magazine: magazineSeenBy(m, ctx.viewer) })),
      ctx.params,
    ),
  'POST /magazine/addView': () => OK,
  'POST /magazine/addBookmark': (ctx) => (toggle(DEMO_MAGAZINE_BOOKMARKS, ctx.params.get('magazineId') ?? '', true), OK),
  'DELETE /magazine/deleteBookmark': (ctx) => (toggle(DEMO_MAGAZINE_BOOKMARKS, ctx.params.get('magazineId') ?? '', false), OK),
  'DELETE /magazine/deleteAllBookmarkByUserId': () => (DEMO_MAGAZINE_BOOKMARKS.splice(0), OK),

  // 사용자·팔로우
  'GET /user/findById': (ctx) => {
    const target = findUser(ctx.params.get('id'));
    return target ? asSeenBy(target, ctx.viewer) : new MockError(404, 'failure:not-found', 'user not found');
  },
  'GET /follow/countFollow': (ctx) => ({
    fromUserCount: followingOf(ctx.params.get('userId')).length,
    toUserCount: followersOf(ctx.params.get('userId')).length,
  }),
  'GET /follow/isFollowed': (ctx) => ctx.params.get('fromUser') === DEMO_USER.id && DEMO_FOLLOWING.includes(ctx.params.get('toUser') ?? ''),
  'GET /follow/findFollowing': (ctx) => followList(ctx, followingOf(ctx.params.get('userId'))),
  'GET /follow/findFollower': (ctx) => followList(ctx, followersOf(ctx.params.get('userId'))),
  'POST /follow/addFollow': (ctx) => (ctx.params.get('fromUser') === DEMO_USER.id && toggle(DEMO_FOLLOWING, ctx.params.get('toUser') ?? '', true), OK),
  'DELETE /follow/removeFollow': (ctx) => (ctx.params.get('fromUser') === DEMO_USER.id && toggle(DEMO_FOLLOWING, ctx.params.get('toUser') ?? '', false), OK),

  // 인증·설정 (P3: 이메일 로그인만 데모 계정으로 성공시킨다)
  'POST /auth/signIn': () => ({ ...DEMO_USER, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', customToken: 'mock-custom-token' }),
  'GET /user/hasProvidedIdAndDeleteAtIsNull': () => false,
  'PATCH /auth/modifyServiceTerm': () => DEMO_USER,
  'PATCH /user/modifyProfile': () => DEMO_USER,
  'GET /user/duplicateUserNickname': () => false,
};

/**
 * user-api 대체. environment.userApiAddress('/mock-api')로 시작하는 요청만 가로챈다.
 * 등록되지 않은 경로는 404 + console.warn 으로 드러낸다(외부로 나가지 않음).
 */
@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const base = environment.userApiAddress;
    if (!req.url.startsWith(base)) {
      return next.handle(req);
    }

    const url = new URL(req.url, window.location.origin);
    const path = url.pathname.slice(base.length).replace(/\/$/, '') || '/';
    const handler = ROUTES[`${req.method} ${path}`];
    const viewer = this.storageService.getUser()?.id ?? null;
    const rawBody = req.body;
    const body = rawBody && typeof rawBody === 'object' && !(rawBody instanceof FormData) ? (rawBody as Record<string, unknown>) : {};

    if (!handler) {
      console.warn(`[mock-api] 미등록 경로: ${req.method} ${path}`);
      return this.fail(req, new MockError(404, 'mock:not-found', `${req.method} ${path}`));
    }

    const result = handler({ params: url.searchParams, body, rawBody, viewer });
    if (result instanceof MockError) {
      return this.fail(req, result);
    }
    return of(new HttpResponse({ status: 200, body: result, url: req.url })).pipe(delay(LATENCY_MS));
  }

  private fail(req: HttpRequest<unknown>, error: MockError): Observable<never> {
    return throwError(
      new HttpErrorResponse({ status: error.status, error: { code: error.code, message: error.message }, url: req.url }),
    );
  }
}
