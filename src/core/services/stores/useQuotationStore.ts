import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  GetAnalytics,
  GetCurrencies,
  GetQuotations,
  SendQuotation,
  TreatQuotation,
} from "../api/quotations.api";

type DataProps = {
  isLoading: boolean;
  quotePagination: Pagination<Quotation>;
  quote: Quotation | null;
  analytics: Analytics;
  errors: any | {};
  query: QuotationQuery;
  currencies: Currency[];
};

interface State extends DataProps {
  reset: () => void;
  updateError: (name: string) => void;
  clearError: () => void;
  treatQuote: (request: TreatQuotation, quoteId: string) => Promise<UIResponse>;
  sendQuote: (request: SendQuotation) => Promise<UIResponse>;
  getQuotes: (query: QuotationQuery) => Promise<void>;
  getCurrencies: () => Promise<void>;
  getAnalytics: () => Promise<void>;
}

const defaultState: DataProps = {
  isLoading: false,
  errors: null,
  quotePagination: {
    currentPage: 1,
    items: [],
    totalItem: 0,
    totalPage: 0,
  },
  quote: null,
  query: {
    customerEmail: "",
    frequency: "",
    pageNumber: 1,
    pageSize: 10,
  },
  currencies: [],
  analytics: {
    quotationsByStatus: {
      Cancelled: 0,
      Closed: 0,
      Draft: 0,
      Invoiced: 0,
      Pending: 0,
    },
    quotationsExpiringSoon: 0,
    topQuotedProducts: [],
    totalQuotations: 0,
    totalQuotationsSent: 0,
  },
};

export const useQuotationStore = create<State>()(
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

        getQuotes: async (query) => {
          set({ isLoading: true });

          var res: UIResponse = await GetQuotations(query);
          set({ quotePagination: res?.data, isLoading: false, query: query });
        },
        getCurrencies: async () => {
          set({ isLoading: true });

          var res: UIResponse = await GetCurrencies();
          set({ currencies: res?.data, isLoading: false });
        },
        getAnalytics: async () => {
          set({ isLoading: true });
          var res: UIResponse = await GetAnalytics();
          set({ analytics: res?.data, isLoading: false });
        },
        sendQuote: async (request) => {
          set({ isLoading: true });
          var res: UIResponse = await SendQuotation(request);

          if (!res?.status) {
            set({ errors: res?.data, isLoading: false });
          } else {
            const updated = get().quotePagination.items.map((quote) =>
              quote.quotationTrackerId === request.trackerId
                ? {
                    ...quote,
                    isSent: true,
                    noOfTimesSent: quote.noOfTimesSent + 1,
                  }
                : quote
            );

            set((state) => ({
              isLoading: false,
              quotePagination: {
                ...state.quotePagination,
                items: updated.length > 0 ? updated : [],
              },
            }));
          }

          res.status ? toast.success(res?.message) : toast.error(res?.message);
          return res;
        },
        treatQuote: async (request, quoteId) => {
          set({ isLoading: true });

          var res: UIResponse = await TreatQuotation(request, quoteId);

          if (!res?.status) {
            set({ errors: res?.data, isLoading: false });
          } else {
            const updated = get().quotePagination.items.map((quote) =>
              quote.quotationId === quoteId ? { ...res?.data } : quote
            );

            set((state) => ({
              isLoading: false,
              quotePagination: {
                ...state.quotePagination,
                items: updated.length > 0 ? updated : [],
              },
            }));
          }

          res.status ? toast.success(res?.message) : toast.error(res?.message);
          return res;
        },
        reset: () => {
          set({ ...defaultState });
        },
      }),
      {
        name: "quotationStore",
        storage: createJSONStorage(() => sessionStorage),
        skipHydration: false,
      }
    )
  )
);
