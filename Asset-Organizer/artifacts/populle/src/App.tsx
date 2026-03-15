import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PopulationProvider } from "@/context/PopulationContext";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import MapPage from "@/pages/Map";
import Cities from "@/pages/Cities";
import Compare from "@/pages/Compare";
import Stats from "@/pages/Stats";
import Quiz from "@/pages/Quiz";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={MapPage} />
      <Route path="/cities" component={Cities} />
      <Route path="/compare" component={Compare} />
      <Route path="/stats" component={Stats} />
      <Route path="/quiz" component={Quiz} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PopulationProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </PopulationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
