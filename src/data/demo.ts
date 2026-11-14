// 체험 모드: 로그인과 백엔드 없이 예시 데이터로 화면을 둘러봅니다.
// VITE_DEMO_ONLY=true로 빌드하면(백엔드 없이 배포) 항상 체험 모드이고 로그인·회원가입은 열지 않습니다.
const demoKey = "butill:demo";

export const demoOnly = import.meta.env.VITE_DEMO_ONLY === "true";

export function isDemo(): boolean {
  if (demoOnly) return true;
  try {
    return sessionStorage.getItem(demoKey) === "1";
  } catch {
    return false;
  }
}

export function startDemo() {
  try {
    sessionStorage.setItem(demoKey, "1");
  } catch {
    // 저장소를 쓸 수 없으면 체험 모드를 유지할 수 없음
  }
}

// 로그인 없이 예시 데이터로 둘러보기
export function enterDemo() {
  startDemo();
  window.location.assign("/home");
}

export function stopDemo() {
  try {
    sessionStorage.removeItem(demoKey);
  } catch {
    // 지울 저장소가 없으면 무시
  }
}
