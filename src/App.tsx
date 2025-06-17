import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inspecciones from "./pages/Inspecciones";
import Documentos from "./pages/Documentos";
import Reportes from "./pages/Reportes";
import Login from "./pages/Login";

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isLogged = !!localStorage.getItem('userRole');
  if (!isLogged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/inspecciones" element={<RequireAuth><Inspecciones /></RequireAuth>} />
          <Route path="/documentos" element={<RequireAuth><Documentos /></RequireAuth>} />
          <Route path="/reportes" element={<RequireAuth><Reportes /></RequireAuth>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
