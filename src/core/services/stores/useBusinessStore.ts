import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  GetBusinessProfile,
  GetOtp,
  LoginBusiness,
  RegisterBusiness,
  ResetPassword,
  UpdateBusinessProfile,
} from "../api/business.api";

type DataProps = {
  isLoading: boolean;
  authData: BusinessLoginResponse | null;
  profile: BusinessProfile | null;
  errors: any | {};
};

interface State extends DataProps {
  reset: () => void;
  updateError: (name: string) => void;
  login: (request: BusinessLogin) => Promise<UIResponse>;
  register: (request: NewBusiness) => Promise<UIResponse>;
  resetPassword: (request: ResetPassword) => Promise<UIResponse>;
  getOtp: (email: string) => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (profile: UpdateProfileRequest) => Promise<UIResponse>;
}

const defaultState: DataProps = {
  isLoading: false,
  authData: null,
  profile: null,
  errors: null,
};

export const useBusinessStore = create<State>()(
  devtools(
    persist(
      (set, get): State => ({
        ...defaultState,
        updateError: (name) =>
          set((state) => ({
            errors: {
              ...state.errors,
              [name]: "",
            },
          })),
        login: async (request) => {
          set({ isLoading: true });

          var res: UIResponse = await LoginBusiness(request);

          if (res?.status) {
            set({
              isLoading: false,
              authData: res?.data,
            });
            localStorage.setItem("token", res?.data?.token);
            toast.success(res?.message);
          } else {
            set({ isLoading: false });
            toast.error(res?.message);
          }
          return res;
        },
        register: async (request) => {
          set({ isLoading: true });
          var res: UIResponse = await RegisterBusiness(request);

          res.status ? toast.success(res?.message) : toast.error(res?.message);
          set({ isLoading: false });

          return res;
        },
        getOtp: async (email) => {
          set({ isLoading: true });

          var res: UIResponse = await GetOtp(email);

          res.status ? toast.success(res?.message) : toast.error(res?.message);

          set({ isLoading: false });
        },
        resetPassword: async (request: ResetPassword) => {
          set({ isLoading: true });

          var res: UIResponse = await ResetPassword(request);
          res.status ? toast.success(res?.message) : toast.error(res?.message);
          set({ isLoading: false });
          return res;
        },
        getProfile: async () => {
          set({ isLoading: true });
          var res: UIResponse = await GetBusinessProfile();
          if (res?.status) {
            set({ profile: res?.data });
          }
          set({ isLoading: false });
        },
        updateProfile: async (profile) => {
          set({ isLoading: true });
          var res: UIResponse = await UpdateBusinessProfile(profile);
          if (res?.status) {
            set({ profile: res?.data });
          }
          set({ isLoading: false });
          return res;
        },
        reset: () => {
          set({ ...defaultState });
        },
      }),
      {
        name: "businessStore",
        storage: createJSONStorage(() => sessionStorage),
        skipHydration: false,
      }
    )
  )
);
