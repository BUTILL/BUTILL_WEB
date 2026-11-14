import { authStorageKey, setRememberLogin, supabase, supabaseConfigured } from "../api/supabase";
import { isDemo, stopDemo } from "./demo";

// Supabase Auth 세션을 사용합니다. 이메일 인증 없이 가입 즉시 로그인됩니다.
export async function signIn(email: string, password: string, remember = false) {
  stopDemo();
  setRememberLogin(remember);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(authMessage(error.message));
}

export async function signUp(email: string, password: string) {
  stopDemo();
  setRememberLogin(false);
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(authMessage(error.message));
  if (!data.session) throw new Error("가입은 되었지만 로그인하지 못했어요. 이메일 인증 후 로그인해 주세요.");
}

// 화면 이동 전 동기 확인용. 실제 토큰 검증은 백엔드가 요청마다 한다. 체험 모드도 접속으로 본다.
export function hasWebSession() {
  return isDemo() || hasAuthSession();
}

// 체험 모드를 빼고 Supabase 로그인 세션만 확인
export function hasAuthSession() {
  try {
    return Boolean(sessionStorage.getItem(authStorageKey) || localStorage.getItem(authStorageKey));
  } catch {
    return false;
  }
}

// 보고서와 시뮬레이션 데이터는 각자의 저장 키에 남겨 둡니다.
export async function clearWebSession() {
  stopDemo();
  if (!supabaseConfigured) return;
  await supabase.auth.signOut().catch(() => undefined);
  try {
    sessionStorage.removeItem(authStorageKey);
    localStorage.removeItem(authStorageKey);
  } catch {
    // 지울 저장소가 없으면 무시
  }
}

function authMessage(message: string) {
  if (/invalid login credentials/i.test(message)) return "이메일 또는 비밀번호가 맞지 않아요.";
  if (/already registered|already been registered/i.test(message)) return "이미 가입된 이메일이에요. 로그인해 주세요.";
  if (/password should be at least/i.test(message)) return "비밀번호는 6자 이상이어야 해요.";
  if (/invalid email|unable to validate email/i.test(message)) return "이메일 형식을 확인해 주세요.";
  if (/rate limit/i.test(message)) return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
  return "로그인 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
