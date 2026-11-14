import { useCallback, useEffect, useState } from "react";
import { ApiError, errorMessage } from "./client";

export type LoadState<T> = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

// 체험 모드에서 백엔드를 부르지 않을 때 쓰는 빈 불러오기
export const loadNothing = async (): Promise<null> => null;

// 화면 진입 시 데이터를 불러오고, 로그인이 만료되면 로그인 화면으로 보낸다
export function useLoad<T>(load: () => Promise<T>): [LoadState<T>, () => Promise<void>] {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });

  const run = useCallback(async () => {
    try {
      setState({ status: "ready", data: await load() });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.location.replace("/login");
        return;
      }
      setState({ status: "error", message: errorMessage(error) });
      throw error;
    }
  }, [load]);

  useEffect(() => {
    run().catch(() => undefined);
  }, [run]);

  return [state, run];
}
