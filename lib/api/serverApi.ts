import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      ...(search.trim() ? { search } : {}),
      ...(tag && tag !== "all" ? { tag } : {}),
    },
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const checkSession = async () => {
  const response = await nextServer.get("/auth/session", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response;
};
