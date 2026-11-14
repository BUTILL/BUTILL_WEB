import { supabase } from "./supabase";

// 백엔드 오류 본문 {code, message}를 그대로 화면에 전달
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const baseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

export async function apiFetch<T>(path: string, options: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth !== false) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new ApiError("UNAUTHORIZED", "로그인이 필요합니다.", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError("NETWORK_ERROR", "서버에 연결할 수 없습니다. 잠시 후 다시 시도하세요.", 0);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(payload?.code ?? "UNKNOWN_ERROR", payload?.message ?? "요청을 처리하지 못했습니다.", response.status);
  }
  return payload as T;
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "요청을 처리하지 못했습니다. 잠시 후 다시 시도하세요.";
}
