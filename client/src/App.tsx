import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import PageLayout from "./components/PageLayout";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./contexts/ThemeContext";
import Group from "./pages/Group";
import Home from "./pages/Home";
import LineFollower from "./pages/LineFollower";
import NormalCar from "./pages/NormalCar";
import StreamingCar from "./pages/StreamingCar";
import UltrasonicCar from "./pages/UltrasonicCar";
import { useState } from "react";

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <PageLayout sidebarOpen={sidebarOpen}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/normal-car" component={NormalCar} />
          <Route path="/ultrasonic-car" component={UltrasonicCar} />
          <Route path="/streaming-car" component={StreamingCar} />
          <Route path="/line-follower" component={LineFollower} />
          <Route path="/group" component={Group} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </PageLayout>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <AppShell />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
