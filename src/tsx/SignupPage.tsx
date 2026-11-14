import { useEffect, useState, type FormEvent } from "react";
import { createStore } from "../api/butill";
import { errorMessage } from "../api/client";
import { supabaseConfigured } from "../api/supabase";
import { demoOnly, enterDemo } from "../data/demo";
import { hasAuthSession, signUp } from "../data/webSession";
import "../css/LoginPage.css";
import "../css/SignupPage.css";

const signupAvailable = supabaseConfigured && !demoOnly;

// 계정을 만든 뒤 분석 대상 매장을 함께 등록합니다. 경영정보는 버틸 앱에서 입력합니다.
export default function SignupPage() {
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "BUTILL | 회원가입";
  }, []);

  const submitSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("passwordConfirm"))) {
      setNotice("비밀번호가 서로 달라요.");
      return;
    }
    setSubmitting(true);
    setNotice("");
    try {
      // 매장 등록만 실패했다면 이미 로그인된 계정으로 다시 시도
      if (!hasAuthSession()) await signUp(String(form.get("email")).trim(), password);
      await createStore({
        name: String(form.get("storeName")).trim(),
        business_type: form.get("businessType") === "cafe" ? "cafe" : "restaurant",
        region: String(form.get("region")).trim(),
        status: form.get("status") === "operating" ? "operating" : "planning",
      });
      window.location.assign("/home");
    } catch (error) {
      setNotice(error instanceof Error && !("code" in error) ? error.message : errorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <main className="web-login-page">
      <header className="web-auth-header">
        <a className="web-auth-brand" href="/intro" aria-label="BUTILL 서비스 소개">
          <img src="/figma/brand-source.png" alt="BUTILL" />
        </a>
        <a href="/login">로그인</a>
      </header>

      <div className="web-login-layout">
        <section className="web-login-intro">
          <h1>
            버틸과 함께
            <br />
            가게 자금 흐름을 챙겨 보세요.
          </h1>
          <p>
            계정을 만들고 매장을 등록하면 현금흐름, 원재료 가격,
            <br className="web-login-desktop-break" />
            세무 일정을 한곳에서 확인할 수 있어요.
          </p>
          <div className="web-login-points">
            <span>✓ 이메일로 바로 가입</span>
            <span>✓ 매장 정보 함께 등록</span>
            <span>✓ 앱과 같은 계정 사용</span>
          </div>
        </section>

        <section className="web-login-card web-signup-card" aria-labelledby="web-signup-title">
          <h2 id="web-signup-title">회원가입</h2>
          <p className="web-login-card-desc">계정과 매장 정보를 입력해 주세요.</p>

          <form onSubmit={submitSignup}>
            <label className="web-login-field">
              이메일
              <input type="email" name="email" autoComplete="email" placeholder="example@email.com" required />
            </label>
            <label className="web-login-field">
              비밀번호
              <span className="web-password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  placeholder="6자 이상"
                  minLength={6}
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
            <label className="web-login-field">
              비밀번호 확인
              <input
                type={showPassword ? "text" : "password"}
                name="passwordConfirm"
                autoComplete="new-password"
                placeholder="비밀번호를 한 번 더 입력하세요"
                minLength={6}
                required
              />
            </label>

            <p className="web-signup-section">매장 정보</p>
            <label className="web-login-field">
              매장 이름
              <input type="text" name="storeName" maxLength={100} placeholder="예: 버틸 닭갈비" required />
            </label>
            <div className="web-signup-row">
              <label className="web-login-field">
                업종
                <select name="businessType" defaultValue="restaurant">
                  <option value="restaurant">음식점</option>
                  <option value="cafe">카페</option>
                </select>
              </label>
              <label className="web-login-field">
                운영 상태
                <select name="status" defaultValue="operating">
                  <option value="operating">운영 중</option>
                  <option value="planning">창업 준비</option>
                </select>
              </label>
            </div>
            <label className="web-login-field">
              지역
              <input type="text" name="region" maxLength={100} defaultValue="서울" placeholder="예: 서울 마포구" required />
            </label>

            <button className="web-login-submit" type="submit" disabled={submitting || !signupAvailable}>
              {submitting ? "가입 중…" : "가입하고 시작하기"} <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="web-login-notice" aria-live="polite">
            {notice || (demoOnly
              ? "회원가입은 준비 중이에요. 지금은 로그인 없이 체험 모드로 둘러볼 수 있어요."
              : supabaseConfigured ? "" : "로그인 설정(VITE_SUPABASE_URL 등)이 없어 가입할 수 없어요.")}
          </p>
          <button className="web-login-demo-link" type="button" onClick={enterDemo}>
            로그인 없이 둘러보기 <span aria-hidden="true">→</span>
          </button>
          <a className="web-login-demo-link" href="/login">
            이미 계정이 있나요? 로그인 <span aria-hidden="true">→</span>
          </a>
        </section>
      </div>

      <footer className="web-auth-footer">가게 운영을 위한 자금 관리 서비스 · BUTILL</footer>
    </main>
  );
}
