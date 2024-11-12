import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { Toaster } from "react-hot-toast";
import Loader from "core/components/loader/Loader";
import { useBusinessStore } from "core/services/stores/useBusinessStore";
import { useCategoryStore } from "core/services/stores/useCategoryStore";
import { useProductStore } from "core/services/stores/useProductStore";
import { useQuotationStore } from "core/services/stores/useQuotationStore";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const isBizLoading = useBusinessStore((store) => store.isLoading);
  const categoryLoading = useCategoryStore((store) => store.isLoading);
  const productLoading = useProductStore((store) => store.isLoading);
  const quoteLoading = useQuotationStore((store) => store.isLoading);

  return (
    <QueryClientProvider client={queryClient}>
      {(isBizLoading || categoryLoading || productLoading || quoteLoading) && (
        <Loader />
      )}
      <Router>
        <Toaster />

        <Routes>
          <Route path="auth/*" element={<AuthLayout />} />
          <Route path="admin/*" element={<AdminLayout />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
