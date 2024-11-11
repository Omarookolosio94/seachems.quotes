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

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const isBizLoading = useBusinessStore((store) => store.isLoading);

  return (
    <QueryClientProvider client={queryClient}>
      {isBizLoading && <Loader />}
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
