# Obsidian Jaccard Plugin PRD

## 개요

jaccard index를 사용하여 열려 있는 노트의 유사한 노트를 찾아서 오른쪽 사이드 뷰에 리스트를 보여주어야 합니다.

## 배경

직관적이고 빠른 계산: 자카드 지수는 두 노트에 공통으로 나타나는 태그, 링크, 키워드 등의 집합을 기반으로 계산됩니다. 이는 복잡한 자연어 처리(NLP) 모델보다 계산이 훨씬 빠르고 리소스를 적게 차지하여, 수많은 노트가 있는 보관소에서도 비교적 신속하게 유사 노트를 찾아낼 수 있습니다.

핵심 개념 기반 연결: 노트의 전체 텍스트를 비교하는 것이 아니라, 사용자가 직접 부여한 **태그(#)** 와 다른 노트로의 **링크([[]])**를 중심으로 유사도를 계산하므로, 노트의 핵심 아이디어나 주제를 중심으로 연결성을 파악하는 데 매우 효과적입니다. 이는 사용자의 의도가 반영된 연결 고리를 찾는 데 도움이 됩니다.

새로운 아이디어 발견: 내가 잊고 있던 과거의 노트나 직접 연결하지 않았던 노트 중에서 현재 작업 중인 노트와 유사한 것을 발견하게 하여, 창의적인 아이디어를 자극하고 지식의 연결을 확장하는 데 기여할 수 있습니다.

지식 관리 효율성 증대: 유사한 노트를 쉽게 찾을 수 있게 되면, 중복된 내용을 정리하거나 관련된 정보를 하나의 마스터 노트로 통합하는 등 지식 관리를 훨씬 효율적으로 할 수 있습니다.

## 기능 요구사항

### 1. 인덱싱 시스템

- 옵시디언이 실행될 때 자동으로 모든 노트를 인덱싱
- 명령어 팔레트를 통해 `jaccard:reindex` 명령으로 수동 인덱싱 가능
- 인덱스 데이터는 `.obsidian/jaccard-index.json`에 저장
- 노트 변경 시 자동 재인덱싱

### 2. 유사도 계산 알고리즘

가중치 기반 자카드 유사도 계산:
- 태그(#): 50% 가중치
- 링크([[]]): 30% 가중치
- 키워드: 20% 가중치

계산 공식:
```javascript
function calculateSimilarity(noteA, noteB) {
    // 태그 유사도 (50%)
    const tagScore = 0.5 * calculateJaccardIndex(noteA.tags, noteB.tags);
    
    // 링크 유사도 (30%)
    const linkScore = 0.3 * calculateJaccardIndex(noteA.links, noteB.links);
    
    // 키워드 유사도 (20%)
    const keywordScore = 0.2 * calculateJaccardIndex(noteA.keywords, noteB.keywords);
    
    return tagScore + linkScore + keywordScore;
}

function calculateJaccardIndex(setA, setB) {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
}
```

### 3. 사이드바 인터페이스

- 현재 열린 노트와 유사한 노트를 최대 100개까지 표시
- 유사도가 높은 순으로 정렬
- 각 노트 항목에 대해 표시:
  - 노트 제목
  - 유사도 점수(%)
  - 공통 태그/링크 수
- 노트 클릭 시 해당 노트 열기
- 토글 버튼으로 사이드바 표시/숨김 제어

## 비기능 요구사항

### 1. 호환성
- Obsidian v1.8.0 이상 지원
- 모든 주요 운영체제(Windows, macOS, Linux) 지원
- 모바일 앱(iOS, Android) 지원

### 2. 성능
- 비동기 인덱싱으로 UI 응답성 보장
- 메모리 사용량 최적화:
  - 인덱스 데이터 압축 저장
  - 필요한 데이터만 메모리에 로드

### 3. 보안
- 로컬 데이터만 사용 (외부 API 호출 없음)
- 사용자의 노트 내용은 항상 로컬에서만 처리

## 사용자 시나리오

### 시나리오 1: 연구 노트 작성
1. 사용자가 새로운 연구 노트를 작성
2. 자동으로 유사한 기존 연구 노트들이 사이드바에 표시
3. 관련 연구 내용을 쉽게 참조하여 작성 가능

### 시나리오 2: 지식베이스 정리
1. 사용자가 기존 노트를 검토
2. 유사한 노트들을 확인하여 중복 내용 식별
3. 관련 내용을 통합하거나 상호 참조 추가

## UI/UX 설계

### 1. 사이드바 디자인
```
+------------------------+
| Similar Notes (85)     |
+------------------------+
| [95%] Research Note A  |
| - 5 common tags       |
| - 3 common links      |
+------------------------+
| [82%] Research Note B  |
| - 4 common tags       |
| - 2 common links      |
+------------------------+
...
```

### 2. 설정 화면
- 가중치 조정 슬라이더:
  - 태그 가중치 (0-100%)
  - 링크 가중치 (0-100%)
  - 키워드 가중치 (0-100%)
- 표시 옵션:
  - 최대 표시 노트 수
  - 최소 유사도 임계값
  - 정렬 기준 설정

## 테스트 계획

### 1. 기능 테스트
- 인덱싱 정확성 검증
- 유사도 계산 알고리즘 검증
- UI 인터랙션 테스트

### 2. 성능 테스트
- 대규모 노트(1000+) 환경에서의 인덱싱 성능
- 메모리 사용량 모니터링
- UI 응답성 테스트

### 3. 호환성 테스트
- 다양한 Obsidian 버전 테스트
- 크로스 플랫폼 테스트
- 다른 플러그인과의 호환성 검증
