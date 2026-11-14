# BUTILL_WEB

소상공인 경영 리스크 관리 서비스 **버틸(BUTILL)**의 웹 분석 화면입니다.
버틸 앱에서 입력한 경영정보를 넓은 화면에서 자세히 분석합니다. 백엔드는 [BUTILL_BE](https://github.com/BUTILL/BUTILL_BE)입니다.

## 화면

| 주소 | 화면 | 사용하는 API |
|---|---|---|
| `/`, `/intro` | 서비스 소개 | — |
| `/login`, `/signup` | 로그인·회원가입(매장 등록 포함) | Supabase Auth, `POST /api/v1/stores` |
| `/home` | 현금흐름 분석 | `GET /stores/{id}/finances` → `POST /analyses/preview` |
| `/report` | 분석 보고서 | 위와 같음 |
| `/simulation` | 자금 시뮬레이션 | `POST /scenarios/compare` |
| `/raw-materials` | 원재료비 분석 | `GET /ingredient-prices`, `GET /stores/{id}/ingredient-costs` |
| `/tax` | 세금 관리 | `GET /stores/{id}/tax-settings` |
| `/support` | 지원사업 | `GET /support-programs` |

백엔드 응답은 `src/api/mappers.ts`에서 화면 형식(`src/data/*.ts`)으로 바꿉니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:5173
```

| 환경변수 | 설명 |
|---|---|
| `VITE_API_URL` | 백엔드 주소. 로컬은 `http://127.0.0.1:8000` |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 주소 |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase **publishable 키만**. secret 키는 절대 넣지 않습니다 |
| `VITE_DEMO_ONLY` | `true`면 백엔드 없이 체험 모드로만 동작합니다(아래 참고) |

`VITE_` 값은 빌드 결과에 그대로 들어가 브라우저에 공개됩니다. 공개해도 되는 값만 넣습니다.
백엔드 `.env`의 `BUTILL_CORS_ORIGINS`에 웹 주소(예: `http://localhost:5173`)가 있어야 API를 호출할 수 있습니다.

## 체험 모드

로그인 없이 예시 데이터(`src/data/*Sample.ts`, `simulation.ts`, `rawMaterials.ts`, `taxCalendar.ts`)로 모든 화면을 둘러보는 모드입니다.
소개·로그인·회원가입 화면의 **로그인 없이 둘러보기**로 들어가고, 상단바에 "체험 모드"가 표시됩니다. 체험 중에는 백엔드를 호출하지 않습니다.
지원사업은 가짜 공고를 만들지 않고 기업마당 링크만 안내합니다. 프로필 메뉴의 **체험 끝내기**로 나갑니다.

`VITE_DEMO_ONLY=true`로 빌드하면 누구나 바로 체험 모드이고 로그인·회원가입은 닫힙니다. 백엔드를 배포하기 전 Vercel에 올릴 때 씁니다.

## 검사

```bash
node --test tests/cashFlow.test.mjs
npm run build
npm run lint
```

## 배포 (Vercel)

1. Vercel에서 `BUTILL/BUTILL_WEB` 레포를 가져옵니다. 설정은 `vercel.json`에 있습니다(Vite, `dist`, 모든 경로를 `index.html`로).
2. 환경변수
   - **백엔드 없이(지금):** `VITE_DEMO_ONLY=true` 하나만 넣습니다.
   - **백엔드 배포 후:** `VITE_DEMO_ONLY`를 지우고 `VITE_API_URL`(**HTTPS 백엔드 주소**), `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 넣은 뒤 다시 배포합니다. 배포 주소는 백엔드 `BUTILL_CORS_ORIGINS`에 추가합니다.

`main`이 배포 브랜치입니다. 작업은 `develop`에서 `feature/*` 브랜치를 따서 PR로 합칩니다.
