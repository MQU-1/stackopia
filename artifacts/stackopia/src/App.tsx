import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/stackopia-ds/components/ui/toaster";
import { TooltipProvider } from "@workspace/stackopia-ds/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter } from "wouter";
import { Nav } from "./components/Nav";
import Home from "./pages/Home";
import SpendRater from "./pages/SpendRater";
import SavingsCircle from "./pages/SavingsCircle";
import InvestCoach from "./pages/InvestCoach";
import PriceHunter from "./pages/PriceHunter";
import FindYourTribe from "./pages/FindYourTribe";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

function AppShell() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Nav />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/spend" component={SpendRater} />
          <Route path="/savings" component={SavingsCircle} />
          <Route path="/invest" component={InvestCoach} />
          <Route path="/prices" component={PriceHunter} />
          <Route path="/tribe" component={FindYourTribe} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function ThemeInit() {
  useEffect(() => {
    const stored = localStorage.getItem("stackopia-theme");
    const root = document.documentElement;
    if (stored === "light") {
      root.classList.remove("dark");
    } else {
      // Default to dark
      root.classList.add("dark");
    }
  }, []);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeInit />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppShell />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
