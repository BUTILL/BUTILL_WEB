const sessionKey = "butill:web-session";

// 현재는 계정 인증 대신 시연 화면의 접속 상태만 저장합니다.
export function startWebSession(remember = false) {
  clearWebSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(sessionKey, "active");
}

export function hasWebSession() {
  return sessionStorage.getItem(sessionKey) === "active" ||
    localStorage.getItem(sessionKey) === "active";
}

// 보고서와 시뮬레이션 데이터는 각자의 저장 키에 남겨 둡니다.
export function clearWebSession() {
  sessionStorage.removeItem(sessionKey);
  localStorage.removeItem(sessionKey);
}
