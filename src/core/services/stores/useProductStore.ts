import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  AddProduct,
  DeleteProduct,
  GetProductByParam,
  GetProducts,
  UpdateProductDetail,
  UpdateProductGallery,
} from "../api/products.api";

type DataProps = {
  isLoading: boolean;
  productPagination: Pagination<Product>;
  product: Product | null;
  errors: any | {};
  query: ProductQuery;
};

interface State extends DataProps {
  reset: () => void;
  resetProduct: () => void;
  updateError: (name: string) => void;
  clearError: () => void;
  addProduct: (product: NewProduct) => Promise<UIResponse>;
  updateProductDetail: (
    detail: ProductDetail,
    productId: string
  ) => Promise<UIResponse>;
  updateProductImage: (images: any[], productId: string) => Promise<UIResponse>;
  deleteProduct: (productId: string) => Promise<void>;
  getProducts: (query: ProductQuery) => Promise<void>;
  getProductByParam: (sku: string, businessId: string) => Promise<void>;
}

const defaultState: DataProps = {
  isLoading: false,
  errors: null,
  productPagination: {
    currentPage: 1,
    items: [],
    totalItem: 0,
    totalPage: 0,
  },
  product: null,
  query: {
    businessId: "",
    categoryId: "",
    listedOnly: false,
    pageNumber: 1,
    pageSize: 10,
  },
};

export const useProductStore = create<State>()(
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
        clearError: () => {
          set({ errors: null });
        },
        resetProduct: () => {
          set({ product: null });
        },
        getProducts: async (query) => {
          set({ isLoading: true });

          var res: UIResponse = await GetProducts(query);
          set({ productPagination: res?.data, isLoading: false, query: query });
        },
        getProductByParam: async (sku, businessId) => {
          set({ isLoading: true });
          var res: UIResponse = await GetProductByParam(sku, businessId);
          set({ product: res?.data, isLoading: false });
        },
        addProduct: async (newProduct) => {
          set({ isLoading: true });

          var res: UIResponse = await AddProduct(newProduct);

          if (!res?.status) {
            set({ errors: res?.data, isLoading: false });
          } else {
            var query = get().query;
            get().getProducts(query);
          }

          res.status ? toast.success(res?.message) : toast.error(res?.message);
          return res;
        },
        updateProductDetail: async (detail, productId) => {
          set({ isLoading: true });

          var res: UIResponse = await UpdateProductDetail(detail, productId);

          if (!res?.status) {
            set({ errors: res?.data, isLoading: false });
          } else {
            const updatedProducts = get().productPagination.items.map((prod) =>
              prod.productId === productId ? { ...res?.data } : prod
            );

            var singleProduct = get().product;

            set((state) => ({
              isLoading: false,
              productPagination: {
                ...state.productPagination,
                items: updatedProducts.length > 0 ? updatedProducts : [],
              },
              product:
                singleProduct.productId === productId
                  ? { ...res?.data }
                  : singleProduct,
            }));
          }

          res.status ? toast.success(res?.message) : toast.error(res?.message);
          return res;
        },
        updateProductImage: async (images, productId) => {
          set({ isLoading: true });

          var res: UIResponse = await UpdateProductGallery(images, productId);

          if (!res?.status) {
            set({ errors: res?.data, isLoading: false });
          } else {
            const updatedProducts = get().productPagination.items.map((prod) =>
              prod.productId === productId ? { ...res?.data } : prod
            );

            var singleProduct = get().product;

            set((state) => ({
              isLoading: false,
              productPagination: {
                ...state.productPagination,
                items: updatedProducts.length > 0 ? updatedProducts : [],
              },
              product:
                singleProduct.productId === productId
                  ? { ...res?.data }
                  : singleProduct,
            }));
          }

          res.status ? toast.success(res?.message) : toast.error(res?.message);
          return res;
        },
        deleteProduct: async (productId) => {
          set({ isLoading: true });

          var res: UIResponse = await DeleteProduct(productId);

          if (res.status) {
            set((state) => ({
              productPagination: {
                ...state.productPagination,
                items: get().productPagination.items.filter(
                  (prod) => prod.productId !== productId
                ),
              },
            }));
          }

          set({ isLoading: false });
          res.status ? toast.success(res?.message) : toast.error(res?.message);
        },
        reset: () => {
          set({ ...defaultState });
        },
      }),
      {
        name: "productStore",
        storage: createJSONStorage(() => sessionStorage),
        skipHydration: false,
      }
    )
  )
);
