// fixture 형태: 원본 템플릿이 실제로 읽는 필드 기준 (stage1-analysis.md 6절)
export interface MockFile {
  id: string;
  url: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface MockUser {
  id: string;
  provider: string;
  name: string;
  nickname: string;
  email: string;
  aboutMe: string;
  picture: MockFile[];
  background: MockFile[];
  agreementAge: boolean;
  agreementPrivacy: boolean;
  agreementServiceTerms: boolean;
  agreementMarketing: boolean;
  signUpType: string;
  isFollow: boolean;
  accessToken?: string;
  refreshToken?: string;
  customToken?: string;
}

export interface MockFeedTag {
  id: string;
  name: string;
  tagCount: number;
}

export interface MockFeedLike {
  feedId: string;
  userId: string;
  user: MockUser;
  createdAt: string;
}

export interface MockFeed {
  id: string;
  writer: MockUser;
  content: string;
  picture: string;
  pictures: MockFile[];
  tags: MockFeedTag[];
  uploadedAt: string;
  createdAt: string;
  likeUsers: MockFeedLike[];
  likeCount: number;
  commentCount: number;
  pictureCount: number;
  isLike: boolean;
  isBookmark: boolean;
}

export interface MockComment {
  id: string;
  feedId: string;
  parentId: string | null;
  writer: MockUser;
  text: string;
  mentions: { id: string; feedCommentId: string; mentionUser: MockUser }[];
  likes: { userId: string }[];
  likeCount: number;
  sub_comment_count: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockMagazineBody {
  id: string;
  magazineId: string;
  title: string;
  body: string;
}

export interface MockMagazine {
  id: string;
  writer: MockUser;
  category: string;
  ko: MockMagazineBody;
  en: MockMagazineBody;
  picture: string;
  tags: { id: string; tagId: string; nameKo: string; nameEn: string; tagCount: number }[];
  createdAt: string;
  likeCount: number;
  isLike: boolean;
  isBookmark: boolean;
  viewCount: number;
}

export interface PageMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  totalCount: number;
  otherCount: number;
}

export interface PageLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface Page<T> {
  items: T[];
  meta: PageMeta;
  links: PageLinks;
}
