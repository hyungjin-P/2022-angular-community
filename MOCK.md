# 목업 모드 실행 안내 (`portfolio/mock`)

키핑 웹 프론트(Angular 14)를 **백엔드·외부 서비스 없이** 로컬에서 띄우기 위한 목업 층입니다.
원본 소스는 고치지 않았습니다. 목업 코드는 모두 `src/_mock/`에 있고, `--configuration=mock` 플래그 하나로 켭니다.
플래그 없이 빌드하면 원본 경로가 그대로이며, 산출물 해시가 목업 층 추가 전과 같습니다.

## 1. 요구 환경

| 항목 | 버전 | 비고 |
|---|---|---|
| Node.js | **14.21.3** (`.nvmrc`) | 당시 lockfile v1(npm 6)과 Angular 14.0 지원 범위(`^14.15 \|\| ^16.10`)에 맞춤 |
| npm | 6.14.18 | Node 14.21.3에 포함 |

Node 14 준비 방법(택1):

```bash
nvm install 14.21.3 && nvm use 14.21.3          # nvm-windows / nvm
volta install node@14.21.3                     # volta
# 또는 https://nodejs.org/dist/v14.21.3/ 의 포터블 zip 을 받아 PATH 앞에 둔다
```

`.env.example`은 해당 없음: Angular 프론트라 `.env`를 쓰지 않습니다. 목업 환경값은 `src/_mock/environment.mock.ts`에 더미로 들어 있습니다.

## 2. 설치·기동

```bash
npm ci                     # lockfile v1 그대로 설치 (nice-napi 네이티브 빌드 경고는 optional 의존성이라 무시)
npm run start:mock         # = ng serve --configuration mock → http://localhost:4200
```

| 주소 | 상태 |
|---|---|
| `http://localhost:4200/feed?as=user` | 데모 사용자 `키핑데모`로 로그인된 상태 |
| `http://localhost:4200/feed?as=guest` | 비로그인 상태 |

`?as=`는 첫 진입 때 한 번만 주면 됩니다. 세션은 탭의 sessionStorage에 남습니다.

이메일 로그인 화면(`/auth/login`)에서는 형식만 맞으면 아무 이메일·비밀번호(영문+숫자 8자 이상)로나 데모 사용자로 로그인됩니다.

정적 빌드:

```bash
npm run build:mock         # = ng build --configuration mock → dist/keeping-angular-mock/
```

SPA라 정적 호스팅할 때는 모든 경로를 `index.html`로 돌려야(fallback) 합니다.

## 3. 원본 대비 변경 목록

`git diff d5d5205..portfolio/mock`

| 파일 | 변경 |
|---|---|
| `src/_mock/**` | **추가** — 목업 층 전부(아래 4절) |
| `angular.json` | `build.configurations.mock`, `serve.configurations.mock` **추가**(기존 설정 무변경) |
| `package.json` | 스크립트 `start:mock`, `build:mock` **추가**(의존성 무변경) |
| `.nvmrc` | **추가** — `14.21.3` |
| `.gitignore` | `/.angular/` 추가 |
| `.angular/cache/**` | git 추적 해제(1,696 파일). 빌드할 때마다 바뀌는 캐시가 추적되고 있었다 |
| 원본 소스(`src/app`, `src/environments`, `src/index.html`, `src/styles.scss` 등) | **변경 없음** |

버전 업그레이드와 의존성 교체는 **없습니다**.

## 4. 목업으로 대체한 기능

| 원본 의존 | 목업 처리 | 위치 |
|---|---|---|
| user-api REST(57개 경로) | `MockApiInterceptor`가 `METHOD /path`로 응답. 좋아요·북마크·팔로우·댓글·글쓰기·탈퇴 유예는 메모리에 반영(**새로고침하면 초기화**) | `src/_mock/mock-api.interceptor.ts`, `fixtures/` |
| 파일 업로드(`POST /file`) | 서버 저장 없이 `data:` URL로 응답 | 같은 파일 `uploadFiles` |
| Firebase Auth (`AngularFireAuth`) | `FakeAngularFireAuth`(서버 통신 없음). `providedIn:'any'`라 부트스트랩 전에 `'root'`로 바꿔 lazy 모듈에도 적용 | `fake-angular-fire-auth.ts`, `main.mock.ts` |
| 소셜 로그인(카카오·네이버·구글·페이스북) | **범위 밖**. 버튼은 동작하지 않는다. 로그인 상태는 `?as=user`나 이메일 로그인으로 만든다 | `session.ts` |
| GA(gtag)·GTM·Meta Pixel·사이트 인증 메타 | 목업 index에서 제거 | `index.mock.html` |
| Google Fonts·materialdesignicons CDN | 로컬 폰트로 대체(Noto Sans KR 가변·Poppins 700·Gmarket Sans·MDI 5.4.55) | `assets/fonts/` |
| 원본 SCSS의 외부 `@import url()`(Google Fonts·jsdelivr) | 원본 수정 없이는 뺄 수 없어 CSP로 **전송 전 차단**하고 같은 이름의 `@font-face`로 대체. 콘솔에 CSP 위반 경고가 남는다 | `index.mock.html` |
| 로그인·회원가입 화면의 `public.keeping.link` 이미지(템플릿 하드코딩) | CSP로 전송 전 차단하고 CSS `content`로 로컬 일러스트 표시 | `index.mock.html` |
| 피드·매거진·프로필 이미지 | 직접 그린 SVG 일러스트 47장. `node src/_mock/tools/gen-images.mjs`로 재생성 | `assets/img/` |

### fixture

전부 지어낸 가짜 데이터입니다. 실제 회원 데이터는 쓰지 않았습니다.
- 사용자 12명 + 매거진 에디터
- 피드 24개와 댓글·답글
- 매거진 10개
- 데모 사용자의 팔로우·스크랩 관계

### 시나리오 (메모리 상태, 새로고침하면 초기화)

| 시나리오 | 재현 | 목업 동작 |
|---|---|---|
| 임시저장 이어쓰기 | `/write`에서 사진·본문을 넣고 등록 없이 다른 화면으로 갔다가 다시 `/write` | `POST /feed/createFeed?rewrite=false`가 등록하지 않은 기존 draft를 돌려준다 → 화면이 "이어서 등록" 모달을 띄운다. `rewrite=true`("새로 등록")면 기존 draft를 버리고 새로 만든다 |
| 회원탈퇴 유예·취소 | `/settings/withdrawal`에서 탈퇴 신청 → 이메일 로그인 | `POST /user/withdrawalTemporary` 이후 `POST /auth/signIn`이 `{code:'failure:deleted', message:<userId>}`(403)로 거절 → "삭제 요청중인 계정" 모달 → `POST /user/withdrawalCancel`로 해제되고 다시 로그인된다 |

서버 동작은 화면 코드에서 역추정했다(가정). 상태 코드는 원본 화면이 보지 않아 임의로 정했다.

캡처 스크립트용으로 목업이 응답한 요청을 `window.__mockApiLog`(`METHOD /path?query` 문자열 배열)에 남긴다. 목업 응답은 HttpClient 안에서 끝나 브라우저 네트워크 로그에 나타나지 않기 때문이다.

### 시각 보정

HEAD 커밋 `d5d5205`의 `src/app/core/utils/date.utils.ts:12-14`가 표시용 경과시간 계산에서 게시 시각에 2개월을 더합니다. 그래서 피드 fixture의 게시 시각은 "지금 − 2개월 − N분"으로 런타임에 만듭니다(`fixtures/time.ts`). 이 계산 때문에 fixture를 JSON이 아닌 TS로 작성했습니다.

## 5. 알려진 제약

- 상태는 메모리에만 있어 새로고침하면 fixture 초기 상태로 돌아갑니다(로그인 세션은 유지).
- 매거진 카드의 외부 기사 링크는 `#`입니다.
- `/test-page`(개발용 라우트)의 외부 데모 이미지는 CSP로 막혀 표시되지 않습니다.
- 콘솔의 "Loading the stylesheet … violates the following Content Security Policy" 경고는 위 CSP 차단 때문이며 의도된 것입니다.

## 6. 서드파티 폰트 라이선스

| 폰트 | 라이선스 | 파일 |
|---|---|---|
| Noto Sans KR | SIL OFL 1.1 | `src/_mock/assets/fonts/noto-sans-kr/LICENSE` |
| Poppins | SIL OFL 1.1 | `src/_mock/assets/fonts/poppins/LICENSE` |
| Material Design Icons 5.4.55 | SIL OFL 1.1 (일부 Google 아이콘은 Apache 2.0, 패키지 표기 `OFL-1.1 AND MIT`) | `src/_mock/assets/fonts/mdi/LICENSE.md` |
| G마켓 산스 | G마켓 무료 폰트(재배포 허용, 폰트 자체 판매 금지). npm `@noonnu/gmarketsans*`에서 가져옴 | `src/_mock/assets/fonts/gmarket/` |
