import { nanoid } from "nanoid";
import type { Member } from "../components/MemberCard";

export const defaultMembers: Member[] = [
  { id: nanoid(), name: "NULL", role: "leader", photo: "" },
  { id: nanoid(), name: "NULL", role: "co-leader", photo: "" },
  { id: nanoid(), name: "NULL", role: "member", photo: "" },
];

export async function loadMembersFromStorage(): Promise<Member[]> {
  if (typeof window === "undefined") return defaultMembers;

  try {
    const response = await fetch("/api/members");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload : defaultMembers;
  } catch {
    return defaultMembers;
  }
}

export async function saveMembersToStorage(members: Member[]) {
  if (typeof window === "undefined") return;

  const response = await fetch("/api/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(members),
  });

  if (!response.ok) {
    throw new Error("Unable to save members");
  }
}

export function exportMembersToFile(members: Member[]) {
  if (typeof window === "undefined") return;

  const payload = {
    exportedAt: new Date().toISOString(),
    members,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rc-car-members-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
