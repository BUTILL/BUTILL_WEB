import type { IngredientPrices, TaxSettings } from "../api/types";

// 체험 모드(배포 사이트, 백엔드 없음)용 스냅숏: 로그인 모드와 같은 화면이 나오도록
// 2026-11-17에 로컬 백엔드에서 받은 응답을 그대로 저장했다.
// - demoPrices: GET /api/v1/ingredient-prices (KAMIS 시세)
// - demoTax: GET /api/v1/stores/{id}/tax-settings, 세금 설정을 저장하기 전(기본값) 응답
// 시세를 새로 반영하려면 같은 API 응답으로 이 파일을 다시 만든다.
export const DEMO_SNAPSHOT_DATE = "2026-11-17";

export const demoPrices = {
  "source": "한국농수산식품유통공사(KAMIS) 일별 소매가격",
  "basis": "서울 조사 시장 평균. 참고 정보이며 매장 식재료비에 자동 반영하지 않습니다.",
  "collected_at": "2026-11-17T05:49:25.015724Z",
  "last_success_at": "2026-11-17T05:49:25.015724Z",
  "status": "success",
  "error_code": null,
  "stale": false,
  "items": [
    {
      "key": "rice",
      "name": "쌀",
      "groups": [
        "common"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "20kg",
      "rank_name": "상품",
      "unit": "20kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 64038,
        "average_price_per_kg": 3202,
        "market_count": 8
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 63700,
        "latest_date": "2026-11-16",
        "latest_price": 64038,
        "change_amount": 338,
        "change_bps": 53
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 63800,
          "average_price_per_kg": 3190,
          "market_count": 4
        },
        {
          "price_date": "2026-10-21",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 3
        },
        {
          "price_date": "2026-10-22",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 3
        },
        {
          "price_date": "2026-10-23",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 3
        },
        {
          "price_date": "2026-10-26",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 2
        },
        {
          "price_date": "2026-10-27",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 1
        },
        {
          "price_date": "2026-10-28",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 1
        },
        {
          "price_date": "2026-10-29",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 1
        },
        {
          "price_date": "2026-10-30",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 1
        },
        {
          "price_date": "2026-11-02",
          "average_price": 62900,
          "average_price_per_kg": 3145,
          "market_count": 1
        },
        {
          "price_date": "2026-11-05",
          "average_price": 63700,
          "average_price_per_kg": 3185,
          "market_count": 8
        },
        {
          "price_date": "2026-11-06",
          "average_price": 63700,
          "average_price_per_kg": 3185,
          "market_count": 8
        },
        {
          "price_date": "2026-11-09",
          "average_price": 63700,
          "average_price_per_kg": 3185,
          "market_count": 8
        },
        {
          "price_date": "2026-11-10",
          "average_price": 63700,
          "average_price_per_kg": 3185,
          "market_count": 8
        },
        {
          "price_date": "2026-11-11",
          "average_price": 64200,
          "average_price_per_kg": 3210,
          "market_count": 8
        },
        {
          "price_date": "2026-11-12",
          "average_price": 64200,
          "average_price_per_kg": 3210,
          "market_count": 8
        },
        {
          "price_date": "2026-11-13",
          "average_price": 64038,
          "average_price_per_kg": 3202,
          "market_count": 8
        },
        {
          "price_date": "2026-11-16",
          "average_price": 64038,
          "average_price_per_kg": 3202,
          "market_count": 8
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 63125,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 62900,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 63433,
          "days": 3
        },
        {
          "week_start": "2026-11-09",
          "average_price": 63968,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 64038,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "onion",
      "name": "양파",
      "groups": [
        "common"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "양파",
      "rank_name": "상품",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 1772,
        "average_price_per_kg": 1772,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 1936,
        "latest_date": "2026-11-16",
        "latest_price": 1772,
        "change_amount": -164,
        "change_bps": -847
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 2179,
          "average_price_per_kg": 2179,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 2179,
          "average_price_per_kg": 2179,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 2136,
          "average_price_per_kg": 2136,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 2136,
          "average_price_per_kg": 2136,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 2222,
          "average_price_per_kg": 2222,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 2356,
          "average_price_per_kg": 2356,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 2212,
          "average_price_per_kg": 2212,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 1906,
          "average_price_per_kg": 1906,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 1924,
          "average_price_per_kg": 1924,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 2102,
          "average_price_per_kg": 2102,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 2102,
          "average_price_per_kg": 2102,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 2112,
          "average_price_per_kg": 2112,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 2004,
          "average_price_per_kg": 2004,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 2004,
          "average_price_per_kg": 2004,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 1936,
          "average_price_per_kg": 1936,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 2179,
          "average_price_per_kg": 2179,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 2179,
          "average_price_per_kg": 2179,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 2131,
          "average_price_per_kg": 2131,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 2020,
          "average_price_per_kg": 2020,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 1772,
          "average_price_per_kg": 1772,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 2158,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 2124,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 2065,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 2089,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 1772,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "green_onion",
      "name": "대파",
      "groups": [
        "common"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "대파",
      "rank_name": "상품",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 2299,
        "average_price_per_kg": 2299,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 2627,
        "latest_date": "2026-11-16",
        "latest_price": 2299,
        "change_amount": -328,
        "change_bps": -1249
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 2811,
          "average_price_per_kg": 2811,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 2974,
          "average_price_per_kg": 2974,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 2974,
          "average_price_per_kg": 2974,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 2974,
          "average_price_per_kg": 2974,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 2912,
          "average_price_per_kg": 2912,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 2912,
          "average_price_per_kg": 2912,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 2887,
          "average_price_per_kg": 2887,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 2832,
          "average_price_per_kg": 2832,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 2639,
          "average_price_per_kg": 2639,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 2359,
          "average_price_per_kg": 2359,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 2682,
          "average_price_per_kg": 2682,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 2592,
          "average_price_per_kg": 2592,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 2644,
          "average_price_per_kg": 2644,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 2627,
          "average_price_per_kg": 2627,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 2627,
          "average_price_per_kg": 2627,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 2627,
          "average_price_per_kg": 2627,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 2583,
          "average_price_per_kg": 2583,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 2347,
          "average_price_per_kg": 2347,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 2299,
          "average_price_per_kg": 2299,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 2299,
          "average_price_per_kg": 2299,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 2933,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 2836,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 2581,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 2497,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 2299,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "garlic",
      "name": "깐마늘(국산)",
      "groups": [
        "common"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "깐마늘(국산)",
      "rank_name": "상품",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 9956,
        "average_price_per_kg": 9956,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 10634,
        "latest_date": "2026-11-16",
        "latest_price": 9956,
        "change_amount": -678,
        "change_bps": -638
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 10070,
          "average_price_per_kg": 10070,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 9826,
          "average_price_per_kg": 9826,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 10818,
          "average_price_per_kg": 10818,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 10973,
          "average_price_per_kg": 10973,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 11229,
          "average_price_per_kg": 11229,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 11267,
          "average_price_per_kg": 11267,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 11489,
          "average_price_per_kg": 11489,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 11560,
          "average_price_per_kg": 11560,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 11560,
          "average_price_per_kg": 11560,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 11429,
          "average_price_per_kg": 11429,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 11560,
          "average_price_per_kg": 11560,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 11240,
          "average_price_per_kg": 11240,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 10793,
          "average_price_per_kg": 10793,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 10793,
          "average_price_per_kg": 10793,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 10634,
          "average_price_per_kg": 10634,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 11146,
          "average_price_per_kg": 11146,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 11146,
          "average_price_per_kg": 11146,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 10612,
          "average_price_per_kg": 10612,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 9956,
          "average_price_per_kg": 9956,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 9956,
          "average_price_per_kg": 9956,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 10422,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 11421,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 11163,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 10699,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 9956,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "napa_cabbage",
      "name": "배추",
      "groups": [
        "common"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "가을",
      "rank_name": "상품",
      "unit": "1포기",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 2285,
        "average_price_per_kg": null,
        "market_count": 8
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 3080,
        "latest_date": "2026-11-16",
        "latest_price": 2285,
        "change_amount": -795,
        "change_bps": -2581
      },
      "daily": [
        {
          "price_date": "2026-10-28",
          "average_price": 4255,
          "average_price_per_kg": null,
          "market_count": 2
        },
        {
          "price_date": "2026-10-29",
          "average_price": 4000,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-30",
          "average_price": 3763,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-02",
          "average_price": 3745,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-03",
          "average_price": 3564,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-04",
          "average_price": 3655,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-05",
          "average_price": 3508,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-06",
          "average_price": 3508,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-09",
          "average_price": 3080,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-10",
          "average_price": 2700,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-11",
          "average_price": 2491,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-12",
          "average_price": 2190,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-13",
          "average_price": 2231,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-16",
          "average_price": 2285,
          "average_price_per_kg": null,
          "market_count": 8
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-26",
          "average_price": 4006,
          "days": 3
        },
        {
          "week_start": "2026-11-02",
          "average_price": 3596,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 2538,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 2285,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "egg",
      "name": "계란(특란 30구)",
      "groups": [
        "common"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "XL30구",
      "rank_name": "일반란",
      "unit": "30구",
      "latest": {
        "price_date": "2026-11-15",
        "average_price": 7201,
        "average_price_per_kg": null,
        "market_count": 1
      },
      "week_change": {
        "base_date": "2026-11-08",
        "base_price": 7227,
        "latest_date": "2026-11-15",
        "latest_price": 7201,
        "change_amount": -26,
        "change_bps": -36
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 6041,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-21",
          "average_price": 6041,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-22",
          "average_price": 6853,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-23",
          "average_price": 6158,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-24",
          "average_price": 6158,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-25",
          "average_price": 6158,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-26",
          "average_price": 6158,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-27",
          "average_price": 6158,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-28",
          "average_price": 6158,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-29",
          "average_price": 6220,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-30",
          "average_price": 5587,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-31",
          "average_price": 5587,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-01",
          "average_price": 6220,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-02",
          "average_price": 6220,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-03",
          "average_price": 6220,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-04",
          "average_price": 6220,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-05",
          "average_price": 7227,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-06",
          "average_price": 7227,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-07",
          "average_price": 7227,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-08",
          "average_price": 7227,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-09",
          "average_price": 7227,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-10",
          "average_price": 7227,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-11",
          "average_price": 7227,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-12",
          "average_price": 7201,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-13",
          "average_price": 7201,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-14",
          "average_price": 7201,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-11-15",
          "average_price": 7201,
          "average_price_per_kg": null,
          "market_count": 1
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 6235,
          "days": 6
        },
        {
          "week_start": "2026-10-26",
          "average_price": 6013,
          "days": 7
        },
        {
          "week_start": "2026-11-02",
          "average_price": 6795,
          "days": 7
        },
        {
          "week_start": "2026-11-09",
          "average_price": 7212,
          "days": 7
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "pork_belly",
      "name": "돼지고기 삼겹살",
      "groups": [
        "common"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "삼겹살",
      "rank_name": "삼겹살",
      "unit": "100g",
      "latest": {
        "price_date": "2026-11-15",
        "average_price": 2933,
        "average_price_per_kg": 30320,
        "market_count": 1
      },
      "week_change": {
        "base_date": "2026-11-08",
        "base_price": 2866,
        "latest_date": "2026-11-15",
        "latest_price": 2933,
        "change_amount": 67,
        "change_bps": 234
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 2989,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-21",
          "average_price": 2997,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-22",
          "average_price": 2942,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-23",
          "average_price": 2939,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-24",
          "average_price": 2939,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-25",
          "average_price": 2939,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-26",
          "average_price": 2864,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-27",
          "average_price": 2919,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-28",
          "average_price": 2990,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-29",
          "average_price": 2972,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-30",
          "average_price": 2822,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-10-31",
          "average_price": 2733,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-01",
          "average_price": 2733,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-02",
          "average_price": 3011,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-03",
          "average_price": 3054,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-04",
          "average_price": 3075,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-05",
          "average_price": 2826,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-06",
          "average_price": 2819,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-07",
          "average_price": 2866,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-08",
          "average_price": 2866,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-09",
          "average_price": 2989,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-10",
          "average_price": 2993,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-11",
          "average_price": 3003,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-12",
          "average_price": 2949,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-13",
          "average_price": 2943,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-14",
          "average_price": 2933,
          "average_price_per_kg": 30320,
          "market_count": 1
        },
        {
          "price_date": "2026-11-15",
          "average_price": 2933,
          "average_price_per_kg": 30320,
          "market_count": 1
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 2958,
          "days": 6
        },
        {
          "week_start": "2026-10-26",
          "average_price": 2862,
          "days": 7
        },
        {
          "week_start": "2026-11-02",
          "average_price": 2931,
          "days": 7
        },
        {
          "week_start": "2026-11-09",
          "average_price": 2963,
          "days": 7
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "chicken",
      "name": "닭(육계)",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "육계(kg)",
      "rank_name": "육계(kg)",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-15",
        "average_price": 4656,
        "average_price_per_kg": 3032,
        "market_count": 1
      },
      "week_change": {
        "base_date": "2026-11-08",
        "base_price": 4656,
        "latest_date": "2026-11-15",
        "latest_price": 4656,
        "change_amount": 0,
        "change_bps": 0
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 4424,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-21",
          "average_price": 4424,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-22",
          "average_price": 4424,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-23",
          "average_price": 4754,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-24",
          "average_price": 4754,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-25",
          "average_price": 4754,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-26",
          "average_price": 4754,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-27",
          "average_price": 4754,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-28",
          "average_price": 4754,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-29",
          "average_price": 4754,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-30",
          "average_price": 4212,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-10-31",
          "average_price": 4212,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-01",
          "average_price": 4212,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-02",
          "average_price": 4212,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-03",
          "average_price": 4212,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-04",
          "average_price": 4414,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-05",
          "average_price": 4414,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-06",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-07",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-08",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-09",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-10",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-11",
          "average_price": 4895,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-12",
          "average_price": 4895,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-13",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-14",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        },
        {
          "price_date": "2026-11-15",
          "average_price": 4656,
          "average_price_per_kg": 3032,
          "market_count": 1
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 4589,
          "days": 6
        },
        {
          "week_start": "2026-10-26",
          "average_price": 4522,
          "days": 7
        },
        {
          "week_start": "2026-11-02",
          "average_price": 4460,
          "days": 7
        },
        {
          "week_start": "2026-11-09",
          "average_price": 4724,
          "days": 7
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "sweet_potato",
      "name": "고구마",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "밤",
      "rank_name": "상품",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 5092,
        "average_price_per_kg": 5092,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 4887,
        "latest_date": "2026-11-16",
        "latest_price": 5092,
        "change_amount": 205,
        "change_bps": 419
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 4957,
          "average_price_per_kg": 4957,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 4957,
          "average_price_per_kg": 4957,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 4957,
          "average_price_per_kg": 4957,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 5104,
          "average_price_per_kg": 5104,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 5179,
          "average_price_per_kg": 5179,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 5112,
          "average_price_per_kg": 5112,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 5112,
          "average_price_per_kg": 5112,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 4798,
          "average_price_per_kg": 4798,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 4092,
          "average_price_per_kg": 4092,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 4092,
          "average_price_per_kg": 4092,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 4092,
          "average_price_per_kg": 4092,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 3950,
          "average_price_per_kg": 3950,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 3991,
          "average_price_per_kg": 3991,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 4028,
          "average_price_per_kg": 4028,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 4887,
          "average_price_per_kg": 4887,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 4887,
          "average_price_per_kg": 4887,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 4954,
          "average_price_per_kg": 4954,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 5180,
          "average_price_per_kg": 5180,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 5056,
          "average_price_per_kg": 5056,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 5092,
          "average_price_per_kg": 5092,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 4994,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 4859,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 4031,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 4993,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 5092,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "cabbage",
      "name": "양배추",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "양배추",
      "rank_name": "상품",
      "unit": "1포기",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 4383,
        "average_price_per_kg": null,
        "market_count": 6
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 4967,
        "latest_date": "2026-11-16",
        "latest_price": 4383,
        "change_amount": -584,
        "change_bps": -1176
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 4790,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-21",
          "average_price": 4960,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-10-22",
          "average_price": 4860,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-10-23",
          "average_price": 4734,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-26",
          "average_price": 4829,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-27",
          "average_price": 4829,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-28",
          "average_price": 4626,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-29",
          "average_price": 4747,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-30",
          "average_price": 4747,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-02",
          "average_price": 4747,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-03",
          "average_price": 4747,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-04",
          "average_price": 4749,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-05",
          "average_price": 5038,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-06",
          "average_price": 5072,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-09",
          "average_price": 4967,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-10",
          "average_price": 4855,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-11",
          "average_price": 4800,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-12",
          "average_price": 4467,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-13",
          "average_price": 4383,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-16",
          "average_price": 4383,
          "average_price_per_kg": null,
          "market_count": 6
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 4836,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 4756,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 4871,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 4694,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 4383,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "perilla_leaf",
      "name": "깻잎",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "깻잎",
      "rank_name": "상품",
      "unit": "50g",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 1562,
        "average_price_per_kg": 31244,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 1481,
        "latest_date": "2026-11-16",
        "latest_price": 1562,
        "change_amount": 81,
        "change_bps": 547
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 1352,
          "average_price_per_kg": 27042,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 1329,
          "average_price_per_kg": 26576,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 1266,
          "average_price_per_kg": 25320,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 1276,
          "average_price_per_kg": 25520,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 1276,
          "average_price_per_kg": 25520,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 1276,
          "average_price_per_kg": 25520,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 1204,
          "average_price_per_kg": 24076,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 1194,
          "average_price_per_kg": 23889,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 1188,
          "average_price_per_kg": 23756,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 1269,
          "average_price_per_kg": 25378,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 1321,
          "average_price_per_kg": 26422,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 1306,
          "average_price_per_kg": 26111,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 1346,
          "average_price_per_kg": 26911,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 1379,
          "average_price_per_kg": 27578,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 1481,
          "average_price_per_kg": 29622,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 1494,
          "average_price_per_kg": 29889,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 1573,
          "average_price_per_kg": 31467,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 1594,
          "average_price_per_kg": 31889,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 1606,
          "average_price_per_kg": 32111,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 1562,
          "average_price_per_kg": 31244,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 1306,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 1228,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 1324,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 1550,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 1562,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "chives",
      "name": "부추",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "부추",
      "rank_name": "상품",
      "unit": "100g",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 893,
        "average_price_per_kg": 8927,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 722,
        "latest_date": "2026-11-16",
        "latest_price": 893,
        "change_amount": 171,
        "change_bps": 2368
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 690,
          "average_price_per_kg": 6899,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 710,
          "average_price_per_kg": 7102,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 696,
          "average_price_per_kg": 6957,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 698,
          "average_price_per_kg": 6977,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 691,
          "average_price_per_kg": 6908,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 686,
          "average_price_per_kg": 6863,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 686,
          "average_price_per_kg": 6863,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 661,
          "average_price_per_kg": 6614,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 648,
          "average_price_per_kg": 6481,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 653,
          "average_price_per_kg": 6534,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 654,
          "average_price_per_kg": 6536,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 654,
          "average_price_per_kg": 6536,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 679,
          "average_price_per_kg": 6786,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 710,
          "average_price_per_kg": 7097,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 722,
          "average_price_per_kg": 7219,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 725,
          "average_price_per_kg": 7252,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 745,
          "average_price_per_kg": 7452,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 807,
          "average_price_per_kg": 8066,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 836,
          "average_price_per_kg": 8363,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 893,
          "average_price_per_kg": 8927,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 699,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 674,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 670,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 767,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 893,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "water_parsley",
      "name": "미나리",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "미나리",
      "rank_name": "상품",
      "unit": "100g",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 1944,
        "average_price_per_kg": 19444,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 1852,
        "latest_date": "2026-11-16",
        "latest_price": 1944,
        "change_amount": 92,
        "change_bps": 497
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 1949,
          "average_price_per_kg": 19489,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 1949,
          "average_price_per_kg": 19489,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 1943,
          "average_price_per_kg": 19433,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 1943,
          "average_price_per_kg": 19433,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 1943,
          "average_price_per_kg": 19433,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 1943,
          "average_price_per_kg": 19433,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 1973,
          "average_price_per_kg": 19733,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 1973,
          "average_price_per_kg": 19733,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 1916,
          "average_price_per_kg": 19156,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 1916,
          "average_price_per_kg": 19156,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 1953,
          "average_price_per_kg": 19533,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 1868,
          "average_price_per_kg": 18678,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 1841,
          "average_price_per_kg": 18411,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 1852,
          "average_price_per_kg": 18522,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 1852,
          "average_price_per_kg": 18522,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 1880,
          "average_price_per_kg": 18800,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 1914,
          "average_price_per_kg": 19144,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 1877,
          "average_price_per_kg": 18767,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 1947,
          "average_price_per_kg": 19467,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 1944,
          "average_price_per_kg": 19444,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 1946,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 1950,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 1886,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 1894,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 1944,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "red_pepper_powder",
      "name": "고춧가루(국산)",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "국산",
      "rank_name": "상품",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 30633,
        "average_price_per_kg": 30633,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 32300,
        "latest_date": "2026-11-16",
        "latest_price": 30633,
        "change_amount": -1667,
        "change_bps": -516
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 33500,
          "average_price_per_kg": 33500,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 32833,
          "average_price_per_kg": 32833,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 32833,
          "average_price_per_kg": 32833,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 32833,
          "average_price_per_kg": 32833,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 33500,
          "average_price_per_kg": 33500,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 33500,
          "average_price_per_kg": 33500,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 33156,
          "average_price_per_kg": 33156,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 32400,
          "average_price_per_kg": 32400,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 32411,
          "average_price_per_kg": 32411,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 32411,
          "average_price_per_kg": 32411,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 32300,
          "average_price_per_kg": 32300,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 31956,
          "average_price_per_kg": 31956,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 31067,
          "average_price_per_kg": 31067,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 31067,
          "average_price_per_kg": 31067,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 32300,
          "average_price_per_kg": 32300,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 32300,
          "average_price_per_kg": 32300,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 31411,
          "average_price_per_kg": 31411,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 31344,
          "average_price_per_kg": 31344,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 31344,
          "average_price_per_kg": 31344,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 30633,
          "average_price_per_kg": 30633,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 33000,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 32993,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 31760,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 31740,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 30633,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "radish",
      "name": "무",
      "groups": [
        "dakgalbi"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "가을",
      "rank_name": "상품",
      "unit": "1개",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 1800,
        "average_price_per_kg": null,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 1909,
        "latest_date": "2026-11-16",
        "latest_price": 1800,
        "change_amount": -109,
        "change_bps": -571
      },
      "daily": [
        {
          "price_date": "2026-10-28",
          "average_price": 1990,
          "average_price_per_kg": null,
          "market_count": 1
        },
        {
          "price_date": "2026-10-29",
          "average_price": 2240,
          "average_price_per_kg": null,
          "market_count": 2
        },
        {
          "price_date": "2026-10-30",
          "average_price": 1860,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-11-02",
          "average_price": 1860,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-11-03",
          "average_price": 1988,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-04",
          "average_price": 1987,
          "average_price_per_kg": null,
          "market_count": 6
        },
        {
          "price_date": "2026-11-05",
          "average_price": 2060,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-06",
          "average_price": 2037,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-09",
          "average_price": 1909,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-10",
          "average_price": 1909,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-11",
          "average_price": 1880,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-12",
          "average_price": 1910,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-13",
          "average_price": 1910,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-16",
          "average_price": 1800,
          "average_price_per_kg": null,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-26",
          "average_price": 2030,
          "days": 3
        },
        {
          "week_start": "2026-11-02",
          "average_price": 1986,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 1904,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 1800,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "tomato",
      "name": "토마토",
      "groups": [
        "pasta"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "토마토",
      "rank_name": "상품",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 3542,
        "average_price_per_kg": 3542,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 4418,
        "latest_date": "2026-11-16",
        "latest_price": 3542,
        "change_amount": -876,
        "change_bps": -1983
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 6379,
          "average_price_per_kg": 6379,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 6379,
          "average_price_per_kg": 6379,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 5810,
          "average_price_per_kg": 5810,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 5638,
          "average_price_per_kg": 5638,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 5357,
          "average_price_per_kg": 5357,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 5412,
          "average_price_per_kg": 5412,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 5301,
          "average_price_per_kg": 5301,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 5206,
          "average_price_per_kg": 5206,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 5101,
          "average_price_per_kg": 5101,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 5048,
          "average_price_per_kg": 5048,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 4659,
          "average_price_per_kg": 4659,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 4547,
          "average_price_per_kg": 4547,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 4364,
          "average_price_per_kg": 4364,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 4364,
          "average_price_per_kg": 4364,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 4418,
          "average_price_per_kg": 4418,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 4324,
          "average_price_per_kg": 4324,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 4102,
          "average_price_per_kg": 4102,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 3732,
          "average_price_per_kg": 3732,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 3542,
          "average_price_per_kg": 3542,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 3542,
          "average_price_per_kg": 3542,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 6052,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 5275,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 4596,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 4024,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 3542,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "cherry_tomato",
      "name": "방울토마토",
      "groups": [
        "pasta"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "대추방울토마토",
      "rank_name": "상품",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 7117,
        "average_price_per_kg": 7117,
        "market_count": 9
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 6774,
        "latest_date": "2026-11-16",
        "latest_price": 7117,
        "change_amount": 343,
        "change_bps": 506
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 8379,
          "average_price_per_kg": 8379,
          "market_count": 9
        },
        {
          "price_date": "2026-10-21",
          "average_price": 8088,
          "average_price_per_kg": 8088,
          "market_count": 9
        },
        {
          "price_date": "2026-10-22",
          "average_price": 8666,
          "average_price_per_kg": 8666,
          "market_count": 9
        },
        {
          "price_date": "2026-10-23",
          "average_price": 8666,
          "average_price_per_kg": 8666,
          "market_count": 9
        },
        {
          "price_date": "2026-10-26",
          "average_price": 8742,
          "average_price_per_kg": 8742,
          "market_count": 9
        },
        {
          "price_date": "2026-10-27",
          "average_price": 8742,
          "average_price_per_kg": 8742,
          "market_count": 9
        },
        {
          "price_date": "2026-10-28",
          "average_price": 8409,
          "average_price_per_kg": 8409,
          "market_count": 9
        },
        {
          "price_date": "2026-10-29",
          "average_price": 8403,
          "average_price_per_kg": 8403,
          "market_count": 9
        },
        {
          "price_date": "2026-10-30",
          "average_price": 7826,
          "average_price_per_kg": 7826,
          "market_count": 9
        },
        {
          "price_date": "2026-11-02",
          "average_price": 7826,
          "average_price_per_kg": 7826,
          "market_count": 9
        },
        {
          "price_date": "2026-11-03",
          "average_price": 7714,
          "average_price_per_kg": 7714,
          "market_count": 9
        },
        {
          "price_date": "2026-11-04",
          "average_price": 7081,
          "average_price_per_kg": 7081,
          "market_count": 9
        },
        {
          "price_date": "2026-11-05",
          "average_price": 6997,
          "average_price_per_kg": 6997,
          "market_count": 9
        },
        {
          "price_date": "2026-11-06",
          "average_price": 6997,
          "average_price_per_kg": 6997,
          "market_count": 9
        },
        {
          "price_date": "2026-11-09",
          "average_price": 6774,
          "average_price_per_kg": 6774,
          "market_count": 9
        },
        {
          "price_date": "2026-11-10",
          "average_price": 6698,
          "average_price_per_kg": 6698,
          "market_count": 9
        },
        {
          "price_date": "2026-11-11",
          "average_price": 6698,
          "average_price_per_kg": 6698,
          "market_count": 9
        },
        {
          "price_date": "2026-11-12",
          "average_price": 7099,
          "average_price_per_kg": 7099,
          "market_count": 9
        },
        {
          "price_date": "2026-11-13",
          "average_price": 6988,
          "average_price_per_kg": 6988,
          "market_count": 9
        },
        {
          "price_date": "2026-11-16",
          "average_price": 7117,
          "average_price_per_kg": 7117,
          "market_count": 9
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 8450,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 8424,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 7323,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 6851,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 7117,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "lemon",
      "name": "레몬",
      "groups": [
        "pasta"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "수입",
      "rank_name": "상품",
      "unit": "10개",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 10268,
        "average_price_per_kg": null,
        "market_count": 5
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 10400,
        "latest_date": "2026-11-16",
        "latest_price": 10268,
        "change_amount": -132,
        "change_bps": -127
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 8258,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-21",
          "average_price": 8258,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-22",
          "average_price": 8258,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-23",
          "average_price": 8258,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-26",
          "average_price": 8698,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-27",
          "average_price": 8698,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-28",
          "average_price": 9066,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-10-29",
          "average_price": 9066,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-10-30",
          "average_price": 9066,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-02",
          "average_price": 9066,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-03",
          "average_price": 9066,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-04",
          "average_price": 10400,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-05",
          "average_price": 10400,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-06",
          "average_price": 10400,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-09",
          "average_price": 10400,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-10",
          "average_price": 10268,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-11",
          "average_price": 10268,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-12",
          "average_price": 10268,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-13",
          "average_price": 10268,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-11-16",
          "average_price": 10268,
          "average_price_per_kg": null,
          "market_count": 5
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 8258,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 8919,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 9866,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 10294,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 10268,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "shrimp",
      "name": "새우(흰다리)",
      "groups": [
        "pasta"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "흰다리(수입)",
      "rank_name": "-",
      "unit": "10마리",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 4559,
        "average_price_per_kg": null,
        "market_count": 7
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 4900,
        "latest_date": "2026-11-16",
        "latest_price": 4559,
        "change_amount": -341,
        "change_bps": -696
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 4901,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-21",
          "average_price": 4901,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-22",
          "average_price": 4901,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-23",
          "average_price": 4901,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-26",
          "average_price": 4901,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-10-27",
          "average_price": 5121,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-10-28",
          "average_price": 5364,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-10-29",
          "average_price": 5364,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-10-30",
          "average_price": 5163,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-02",
          "average_price": 5163,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-03",
          "average_price": 5163,
          "average_price_per_kg": null,
          "market_count": 8
        },
        {
          "price_date": "2026-11-04",
          "average_price": 4900,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-05",
          "average_price": 4900,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-06",
          "average_price": 4900,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-09",
          "average_price": 4900,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-10",
          "average_price": 4900,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-11",
          "average_price": 4901,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-12",
          "average_price": 4559,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-13",
          "average_price": 4559,
          "average_price_per_kg": null,
          "market_count": 7
        },
        {
          "price_date": "2026-11-16",
          "average_price": 4559,
          "average_price_per_kg": null,
          "market_count": 7
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 4901,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 5183,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 5005,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 4764,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 4559,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "squid",
      "name": "물오징어(원양 냉동)",
      "groups": [
        "pasta"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "원양(냉동)",
      "rank_name": "小",
      "unit": "1마리",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 3173,
        "average_price_per_kg": null,
        "market_count": 3
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 3080,
        "latest_date": "2026-11-16",
        "latest_price": 3173,
        "change_amount": 93,
        "change_bps": 302
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 3754,
          "average_price_per_kg": null,
          "market_count": 5
        },
        {
          "price_date": "2026-10-21",
          "average_price": 3868,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-22",
          "average_price": 3433,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-23",
          "average_price": 3768,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-26",
          "average_price": 3768,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-27",
          "average_price": 3768,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-28",
          "average_price": 3768,
          "average_price_per_kg": null,
          "market_count": 4
        },
        {
          "price_date": "2026-10-29",
          "average_price": 3780,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-10-30",
          "average_price": 3180,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-02",
          "average_price": 3180,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-03",
          "average_price": 3180,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-04",
          "average_price": 3180,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-05",
          "average_price": 3080,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-06",
          "average_price": 3080,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-09",
          "average_price": 3080,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-10",
          "average_price": 3080,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-11",
          "average_price": 3173,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-12",
          "average_price": 3173,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-13",
          "average_price": 3173,
          "average_price_per_kg": null,
          "market_count": 3
        },
        {
          "price_date": "2026-11-16",
          "average_price": 3173,
          "average_price_per_kg": null,
          "market_count": 3
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 3706,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 3653,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 3140,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 3136,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 3173,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    },
    {
      "key": "clam",
      "name": "바지락",
      "groups": [
        "pasta"
      ],
      "status": "success",
      "error_code": null,
      "stale": false,
      "region_code": "1101",
      "kind_name": "냉장",
      "rank_name": "-",
      "unit": "1kg",
      "latest": {
        "price_date": "2026-11-16",
        "average_price": 11169,
        "average_price_per_kg": 11169,
        "market_count": 11
      },
      "week_change": {
        "base_date": "2026-11-09",
        "base_price": 10703,
        "latest_date": "2026-11-16",
        "latest_price": 11169,
        "change_amount": 466,
        "change_bps": 435
      },
      "daily": [
        {
          "price_date": "2026-10-20",
          "average_price": 10234,
          "average_price_per_kg": 10234,
          "market_count": 10
        },
        {
          "price_date": "2026-10-21",
          "average_price": 10234,
          "average_price_per_kg": 10234,
          "market_count": 10
        },
        {
          "price_date": "2026-10-22",
          "average_price": 10401,
          "average_price_per_kg": 10401,
          "market_count": 10
        },
        {
          "price_date": "2026-10-23",
          "average_price": 10401,
          "average_price_per_kg": 10401,
          "market_count": 10
        },
        {
          "price_date": "2026-10-26",
          "average_price": 10211,
          "average_price_per_kg": 10211,
          "market_count": 10
        },
        {
          "price_date": "2026-10-27",
          "average_price": 10211,
          "average_price_per_kg": 10211,
          "market_count": 10
        },
        {
          "price_date": "2026-10-28",
          "average_price": 10211,
          "average_price_per_kg": 10211,
          "market_count": 10
        },
        {
          "price_date": "2026-10-29",
          "average_price": 10211,
          "average_price_per_kg": 10211,
          "market_count": 10
        },
        {
          "price_date": "2026-10-30",
          "average_price": 10401,
          "average_price_per_kg": 10401,
          "market_count": 10
        },
        {
          "price_date": "2026-11-02",
          "average_price": 10401,
          "average_price_per_kg": 10401,
          "market_count": 10
        },
        {
          "price_date": "2026-11-03",
          "average_price": 10567,
          "average_price_per_kg": 10567,
          "market_count": 10
        },
        {
          "price_date": "2026-11-04",
          "average_price": 10567,
          "average_price_per_kg": 10567,
          "market_count": 10
        },
        {
          "price_date": "2026-11-05",
          "average_price": 9872,
          "average_price_per_kg": 9872,
          "market_count": 10
        },
        {
          "price_date": "2026-11-06",
          "average_price": 10784,
          "average_price_per_kg": 10784,
          "market_count": 11
        },
        {
          "price_date": "2026-11-09",
          "average_price": 10703,
          "average_price_per_kg": 10703,
          "market_count": 11
        },
        {
          "price_date": "2026-11-10",
          "average_price": 10703,
          "average_price_per_kg": 10703,
          "market_count": 11
        },
        {
          "price_date": "2026-11-11",
          "average_price": 10703,
          "average_price_per_kg": 10703,
          "market_count": 11
        },
        {
          "price_date": "2026-11-12",
          "average_price": 11046,
          "average_price_per_kg": 11046,
          "market_count": 10
        },
        {
          "price_date": "2026-11-13",
          "average_price": 11169,
          "average_price_per_kg": 11169,
          "market_count": 11
        },
        {
          "price_date": "2026-11-16",
          "average_price": 11169,
          "average_price_per_kg": 11169,
          "market_count": 11
        }
      ],
      "weekly": [
        {
          "week_start": "2026-10-19",
          "average_price": 10318,
          "days": 4
        },
        {
          "week_start": "2026-10-26",
          "average_price": 10249,
          "days": 5
        },
        {
          "week_start": "2026-11-02",
          "average_price": 10438,
          "days": 5
        },
        {
          "week_start": "2026-11-09",
          "average_price": 10865,
          "days": 5
        },
        {
          "week_start": "2026-11-16",
          "average_price": 11169,
          "days": 1
        }
      ],
      "missing_count": 0,
      "duplicate_count": 0,
      "invalid_count": 0
    }
  ]
} as IngredientPrices;

export const demoTax = {
  "store_id": "00000000-0000-0000-0000-000000000000",
  "settings": {
    "business_entity": "individual",
    "tax_type": "general",
    "filing_method": "accountant",
    "reserve_method": "monthly",
    "employees": "yes",
    "installments": 1
  },
  "saved": false,
  "schedule": [
    {
      "code": "income_tax_prepaid",
      "title": "종합소득세 중간예납",
      "due_date": "2026-11-30",
      "days_left": 13,
      "note": null
    },
    {
      "code": "withholding",
      "title": "원천세 신고·납부와 4대보험 납부",
      "due_date": "2026-12-10",
      "days_left": 23,
      "note": "직원 급여를 지급한 다음 달 10일"
    },
    {
      "code": "vat_2nd_final",
      "title": "부가가치세 2기 확정신고·납부",
      "due_date": "2027-01-25",
      "days_left": 69,
      "note": null
    },
    {
      "code": "vat_1st_prepaid",
      "title": "부가가치세 1기 예정고지 납부",
      "due_date": "2027-04-26",
      "days_left": 160,
      "note": null
    },
    {
      "code": "income_tax",
      "title": "종합소득세 신고·납부",
      "due_date": "2027-05-31",
      "days_left": 195,
      "note": null
    },
    {
      "code": "vat_1st_final",
      "title": "부가가치세 1기 확정신고·납부",
      "due_date": "2027-07-26",
      "days_left": 251,
      "note": null
    },
    {
      "code": "vat_2nd_prepaid",
      "title": "부가가치세 2기 예정고지 납부",
      "due_date": "2027-10-25",
      "days_left": 342,
      "note": null
    }
  ],
  "basis": "세법상 기본 신고·납부 기한 기준 참고 일정입니다. 세액은 계산하지 않으며, 주말이면 다음 평일로 옮겼습니다."
} as TaxSettings;
