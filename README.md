# 청년 정책 알림 위젯 — 설정 가이드

노트북을 켤 때마다 맥 배경화면에 "새 소식 N개" 카드가 뜨고, 클릭하면 신청 페이지로
바로 연결되는 시스템입니다. 클라우드(GitHub)가 매일 자동으로 정보를 수집하고,
맥의 Übersicht 위젯이 그 결과를 보여줍니다.

```
GitHub Actions (매일 자동 수집) → docs/data.json → GitHub Pages 공개
                                                        ↓
                                        Übersicht 위젯 (배경화면에 표시)
```

## 1단계. 온통청년 API 키 발급받기 (심사 있음, 시간이 걸릴 수 있어요)

1. https://www.youthcenter.go.kr 회원가입 및 로그인
2. [마이페이지 → OPEN API] 메뉴에서 인증키 발급 신청
3. 담당자 심사 후 승인되면 인증키(`openApiVlak`)를 이메일 또는 마이페이지에서 확인

승인 전에는 아래 2~4단계를 먼저 준비해두고, 키를 받으면 3단계 시크릿에 넣어주세요.

## 2단계. GitHub 저장소 만들기

1. github.com 에서 새 저장소 생성 (예: `benefit-alert`), Public 으로 설정
2. 이 폴더(`benefit-alert`) 안의 모든 파일을 그대로 그 저장소에 업로드
   - GitHub 웹사이트에서 드래그 앤 드롭으로 업로드해도 되고,
   - 터미널을 쓸 수 있으면:
     ```
     cd benefit-alert
     git init
     git add .
     git commit -m "init"
     git branch -M main
     git remote add origin https://github.com/내아이디/benefit-alert.git
     git push -u origin main
     ```

## 3단계. API 키를 GitHub Secret으로 등록

1. 저장소 페이지 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `YOUTHCENTER_API_KEY`, Value: 발급받은 인증키 입력 후 저장

## 4단계. GitHub Pages 켜기

1. 저장소 Settings → Pages
2. Source: `Deploy from a branch` 선택
3. Branch: `main`, 폴더: `/docs` 선택 후 저장
4. 몇 분 후 `https://내아이디.github.io/benefit-alert/data.json` 주소로 접속되는지 확인

## 5단계. 자동 수집 켜기

- Actions 탭 → "매일 청년 정책 수집" 워크플로우 선택 → "Run workflow" 눌러서 첫 실행 테스트
- 정상 실행되면 `docs/data.json` 파일이 자동으로 갱신된 커밋이 생깁니다
- 이후로는 매일 한국시간 오전 7시에 자동 실행됩니다 (시간 바꾸고 싶으면
  `.github/workflows/daily.yml` 의 `cron` 값 수정)

## 6단계. Übersicht 위젯 설치 (맥)

1. Übersicht 설치: https://tracesof.net/uebersicht/ 에서 다운로드하거나
   터미널에서 `brew install --cask ubersicht`
2. Übersicht 실행 → 메뉴바 아이콘 → "Open widgets folder"
3. 그 폴더 안에 `benefit-alert` 폴더를 새로 만들고, `ubersicht-widget/benefit-alert.jsx`
   파일을 그 안에 복사
4. `benefit-alert.jsx` 파일을 열어서 맨 위 `DATA_URL` 을
   본인의 GitHub Pages 주소로 수정:
   ```js
   const DATA_URL = "https://내아이디.github.io/benefit-alert/data.json";
   ```
5. Übersicht 메뉴바 아이콘 → "Refresh" — 배경화면 오른쪽 위에 카드가 나타납니다

이제 맥북을 켤 때마다 배경화면에 새 소식 개수가 뜨고, 항목을 클릭하면 신청
페이지가 바로 열립니다.

## 카테고리/키워드 바꾸고 싶을 때

`scripts/fetch_policies.py` 상단의 `CATEGORIES` 딕셔너리를 수정하면 됩니다.
예: 서울시 청년 정책만 더 챙기고 싶다면 `"서울 청년 안심"` 같은 키워드를 추가하세요.

## 다음 단계 (원하시면 이어서 만들어드릴게요)

- 맥 알림창(팝업)으로도 새 소식 뜨게 하기 (launchd + terminal-notifier)
- 웹 대시보드 페이지 (홈 화면으로 지정해서 브라우저 열자마자 보이게)
- LH청약센터, 마이홈포털, 서울시 청년몽땅정보통 등 추가 소스 연동
