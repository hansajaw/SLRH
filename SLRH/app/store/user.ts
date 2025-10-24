import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./storage";

export type UserProfile = {
  fullName: string;
  email: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zip?: string;
  avatarUri?: string;
};

type UserState = {
  me: UserProfile | null;
  setProfile: (p: Partial<UserProfile>) => void;
  replaceProfile: (p: UserProfile) => void;
  setAvatar: (uri?: string) => void;
  signOut: () => void;
};

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      me: {
        fullName: "Dulneth Hansaja Wickrama",
        email: "wickramahansaja@gmail.com",
        phone: "0775688076",
        address1: "No: 07, Siri rahal mawatha",
        address2: "Wanduramulla",
        city: "Panadura",
        zip: "12500",
        avatarUri: undefined,
      },
      setProfile: (p) => {
        const cur = get().me ?? ({} as UserProfile);
        set({ me: { ...cur, ...p } });
      },
      replaceProfile: (p) => set({ me: p }),
      setAvatar: (uri) => {
        const cur = get().me;
        if (!cur) return;
        set({ me: { ...cur, avatarUri: uri } });
      },
      signOut: () => set({ me: null }),
    }),
    {
      name: "slrh-user",
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
    }
  )
);
