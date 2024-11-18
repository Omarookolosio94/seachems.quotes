import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  AddUpdateCategory,
  DeleteCategory,
  GetCategories,
} from "../api/category.api";

type DataProps = {
  isLoading: boolean;
  categories: Category[];
  errors: any | {};
};

interface State extends DataProps {
  reset: () => void;
  updateError: (name: string) => void;
  addUpdateCategory: (
    category: NewCategory,
    categoryId: number
  ) => Promise<UIResponse>;
  getCategory: (businessId: string) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
}

const defaultState: DataProps = {
  isLoading: false,
  errors: null,
  categories: [],
};

export const useCategoryStore = create<State>()(
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
        getCategory: async (businessId) => {
          set({ isLoading: true });

          var res: UIResponse = await GetCategories(businessId);
          set({ categories: res?.data, isLoading: false });
        },
        addUpdateCategory: async (category, categoryId) => {
          set({ isLoading: true });
          var isUpdate = categoryId > 0;

          var res: UIResponse = await AddUpdateCategory(category, categoryId);

          if (!res?.status) {
            set({ errors: res?.data, isLoading: false });
          } else {
            if (isUpdate) {
              const updatedCategory = get().categories.map((cat) =>
                cat?.categoryId === categoryId ? { ...res?.data } : cat
              );

              set({
                categories: updatedCategory?.length > 0 ? updatedCategory : [],
                isLoading: false,
              });
            } else {
              set((state) => ({
                categories: [res?.data, ...state.categories],
                isLoading: false,
              }));
            }
          }

          res.status ? toast.success(res?.message) : toast.error(res?.message);
          return res;
        },
        deleteCategory: async (categoryId) => {
          set({ isLoading: true });

          var res: UIResponse = await DeleteCategory(categoryId);

          if (res.status) {
            set({
              categories: get().categories.filter(
                (cat) => cat?.categoryId !== categoryId
              ),
            });
          }

          set({ isLoading: false });
          res.status ? toast.success(res?.message) : toast.error(res?.message);
        },
        reset: () => {
          set({ ...defaultState });
        },
      }),
      {
        name: "categoryStore",
        storage: createJSONStorage(() => sessionStorage),
        skipHydration: false,
      }
    )
  )
);
