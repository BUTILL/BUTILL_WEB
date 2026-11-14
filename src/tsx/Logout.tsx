import { useEffect, useId, useRef, useState } from "react";
import { isDemo } from "../data/demo";
import { clearWebSession } from "../data/webSession";
import logoutIcon from "../assets/Logout_icon.png";
import "../css/Logout.css";

export default function Logout() {
  const [open, setOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [demo] = useState(isDemo);
  const popupId = useId();
  const profileButton = useRef<HTMLButtonElement>(null);
  const redirectTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(redirectTimer.current), []);

  // 접속 상태를 종료한 뒤 완료 문구를 1초간 표시합니다.
  function handleLogout() {
    if (redirectTimer.current !== undefined) return;
    clearWebSession();
    setLoggedOut(true);
    redirectTimer.current = window.setTimeout(() => window.location.replace("/"), 1000);
  }

  return (
    <div
      className="logout"
      onBlur={(event) => {
        if (redirectTimer.current === undefined && !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open && !loggedOut) {
          setOpen(false);
          profileButton.current?.focus();
        }
      }}
    >
      <button
        ref={profileButton}
        className="logout-profile"
        type="button"
        aria-label="프로필"
        aria-expanded={open}
        aria-controls={popupId}
        disabled={loggedOut}
        onClick={() => setOpen((visible) => !visible)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-8 9a8 8 0 0 1 16 0" />
        </svg>
      </button>
      <div id={popupId} className="logout-popup" hidden={!open}>
        <button className="logout-action" type="button" disabled={loggedOut} onClick={handleLogout}>
          <img src={logoutIcon} alt="" width={25} height={25} />
          {demo ? "체험 끝내기" : "로그아웃"}
        </button>
        <div className="logout-status" role="status">
          {loggedOut && (demo ? "체험을 종료했어요" : "로그아웃이 되었습니다")}
        </div>
      </div>
    </div>
  );
}
