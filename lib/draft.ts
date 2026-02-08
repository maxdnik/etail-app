// lib/draft.ts
// @ts-nocheck

const KEY = "etaIlDraft";
const ID_KEY = "etaIlId";

export function getEtaIlId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ID_KEY);
}

export function setEtaIlId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ID_KEY, id);
}

export function getDraft(): any {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function setDraft(draft: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(draft || {}));
}

export function updateDraft(partial: any) {
  const prev = getDraft();
  const next = {
    ...prev,
    ...partial,
    travel: { ...(prev.travel || {}), ...(partial.travel || {}) },
    passport: { ...(prev.passport || {}), ...(partial.passport || {}) },
    personal: { ...(prev.personal || {}), ...(partial.personal || {}) },
    declaration: { ...(prev.declaration || {}), ...(partial.declaration || {}) },
  };
  setDraft(next);
  return next;
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}