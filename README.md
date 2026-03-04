# emfocus-signature-app

이엠포커스 전자서명 웹 애플리케이션입니다. Canvas 기반의 서명 입력 UI를 제공하고, Supabase Storage에 서명 이미지를 저장합니다.

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **Framework** | Next.js (App Router) | 16.0.6 |
| **Language** | TypeScript | 5.x |
| **UI** | React | 19.2 |
| **Styling** | Tailwind CSS | 4.x |
| **Database / Storage** | Supabase | 2.86.0 |

## 주요 기능

### 전자서명 캔버스
- Canvas API 기반 서명 그리기 (마우스 + 터치 지원)
- Device Pixel Ratio 대응으로 고해상도 디스플레이 지원
- 리사이즈 시 서명 데이터 자동 보존 및 복원
- 서명 상태 표시 (대기중 / 서명됨)
- 점선 가이드라인 제공

### 서명 저장
- 서명 데이터를 PNG 이미지로 변환
- Supabase Storage (`signatures` 버킷)에 업로드
- 파일명 sanitize 처리 (한글/영문/숫자 허용, 특수문자 제거)
- 한글 파일명 URL 인코딩으로 Storage 호환성 확보
- 타임스탬프 기반 고유 파일명 생성

### UI/UX
- 모바일 최적화 반응형 레이아웃
- 다크 테마 (zinc 컬러 기반)
- 업로드 상태 피드백 (로딩 스피너, 성공/실패 알림)
- `touchAction: none`으로 모바일 스크롤 방지

## 프로젝트 구조

```
emfocus-signature-app/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지 (서명 입력 + 업로드)
│   └── globals.css         # 전역 스타일
├── components/
│   └── SignatureCanvas.tsx  # 서명 캔버스 컴포넌트
├── lib/
│   └── supabase.ts         # Supabase 클라이언트 설정
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- Supabase 프로젝트 (Storage 버킷 `signatures` 생성 필요)

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 정보를 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase Storage 설정

Supabase 대시보드에서 `signatures` 이름의 Storage 버킷을 생성합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 빌드

```bash
npm run build
npm start
```
