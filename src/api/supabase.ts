import { createClient } from "@supabase/supabase-js";

// 로그인 상태 유지를 선택하면 localStorage, 아니면 브라우저를 닫을 때 지워지는 sessionStorage에 저장
export const authStorageKey = "butill-auth";
const rememberKey = "butill:remember-login";

function remembered() {
  try {
    return localStorage.getItem(rememberKey) === "1";
  } catch {
    return false;
  }
}

export function setRememberLogin(remember: boolean) {
  try {
    if (remember) localStorage.setItem(rememberKey, "1");
    else localStorage.removeItem(rememberKey);
  } catch {
    // 저장소를 쓸 수 없으면 현재 탭에서만 로그인 유지
  }
}

const authStorage = {
  getItem: (key: string) => {
    try {
      return sessionStorage.getItem(key) ?? localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      (remembered() ? localStorage : sessionStorage).setItem(key, value);
    } catch {
      // 저장 실패 시 다음 요청에서 다시 로그인
    }
  },
  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch {
      // 지울 저장소가 없으면 무시
    }
  },
};

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(url && key);

export const supabase = createClient(url || "https://invalid.supabase.co", key || "missing-key", {
  auth: { storage: authStorage, storageKey: authStorageKey, persistSession: true, autoRefreshToken: true },
});
