import { useEffect, useState, type FormEvent } from "react";
import { supabaseConfigured } from "../api/supabase";
import { signIn } from "../data/webSession";
import "../css/LoginPage.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogin, setKeepLogin] = useState(false);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "BUTILL | 로그인";
  }, []);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setNotice("");
    try {
      await signIn(String(form.get("email")).trim(), String(form.get("password")), keepLogin);
      window.location.assign("/home");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "로그인하지 못했어요.");
      setSubmitting(false);
    }
  };

  return (
    <main className="web-login-page">
      <header className="web-auth-header">
        <a className="web-auth-brand" href="/intro" aria-label="BUTILL 서비스 소개">
          <img src="/figma/brand-source.png" alt="BUTILL" />
        </a>
        <a href="/intro">서비스 소개</a>
      </header>

      <div className="web-login-layout">
        <section className="web-login-intro">
          <h1>
            다시 만나 반가워요.
            <br />
            오늘의 가게 상황을 확인해 보세요.
          </h1>
          <p>
            로그인하면 우리 가게의 자금 흐름과 운영 정보를
            <br className="web-login-desktop-break" />
            이어서 확인할 수 있어요.
          </p>
          <div className="web-login-points">
            <span>✓ 매출과 지출 한눈에 보기</span>
            <span>✓ 원재료 가격 변화 확인</span>
            <span>✓ 세무 일정 미리 챙기기</span>
          </div>
        </section>

        <section className="web-login-card" aria-labelledby="web-login-title">
          <h2 id="web-login-title">로그인</h2>
          <p className="web-login-card-desc">BUTILL 계정으로 시작해 보세요.</p>

          <form onSubmit={submitLogin}>
            <label className="web-login-field">
              이메일
              <input
                type="email"
                name="email"
                autoComplete="username"
                placeholder="이메일을 입력하세요"
                required
              />
            </label>
            <label className="web-login-field">
              비밀번호
              <span className="web-password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? "숨기기" : "표시"}
                </button>
              </span>
            </label>

            <div className="web-login-options">
              <label>
                <input
                  type="checkbox"
                  checked={keepLogin}
                  onChange={(event) => setKeepLogin(event.target.checked)}
                />
                로그인 상태 유지
              </label>
              <button
                type="button"
                onClick={() => setNotice("계정 찾기는 추후 연결될 예정이에요.")}
              >
                계정 찾기
              </button>
            </div>

            <button className="web-login-submit" type="submit" disabled={submitting || !supabaseConfigured}>
              {submitting ? "로그인 중…" : "로그인"} <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="web-login-notice" aria-live="polite">
            {notice || (supabaseConfigured ? "" : "로그인 설정(VITE_SUPABASE_URL 등)이 없어 로그인할 수 없어요.")}
          </p>
          <a className="web-login-demo-link" href="/signup">
            처음이신가요? 회원가입 <span aria-hidden="true">→</span>
          </a>
          <div className="web-login-footer">
            <span>버틸 앱과 같은 계정으로 로그인할 수 있어요.</span>
          </div>
        </section>
      </div>

      <footer className="web-auth-footer">가게 운영을 위한 자금 관리 서비스 · BUTILL</footer>
    </main>
  );
}
