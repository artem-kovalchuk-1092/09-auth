import axios from "axios";
import { nextServer } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export type AuthRequest = {
  email: string;
  password: string;
};

export type UpdateMeRequest = {
  username: string;
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
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (payload: AuthRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/register", payload);
  return response.data;
};

export const login = async (payload: AuthRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/login", payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const response = await nextServer.get<{ success: boolean }>("/auth/session");
  return response.data.success;
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (payload: UpdateMeRequest): Promise<User> => {
  const response = await nextServer.patch<User>("/users/me", payload);
  return response.data;
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string;
          error?: string;
          response?: { message?: string };
        }
      | undefined;

    return (
      data?.response?.message ||
      data?.message ||
      data?.error ||
      error.message
    );
  }

  return "Something went wrong. Please try again.";
};
