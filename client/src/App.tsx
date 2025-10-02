import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NecklineWizard from "@/pages/NecklineWizard";
import BlanketWizard from "@/pages/BlanketWizard";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav style={{
      backgroundColor: 'var(--accent)',
      padding: '1rem 2rem',
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: 0,
        fontFamily: 'Poppins, sans-serif'
      }}>
        Wizard Builder
      </h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/">
          <a
            data-testid="link-neckline-wizard"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: location === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'background-color 0.2s',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              if (location !== '/') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location !== '/') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Neckline/Shoulder Practice
          </a>
        </Link>
        <Link href="/blanket">
          <a
            data-testid="link-blanket-wizard"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: location === '/blanket' ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'background-color 0.2s',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              if (location !== '/blanket') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location !== '/blanket') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Blanket Pattern
          </a>
        </Link>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={NecklineWizard}/>
      <Route path="/blanket" component={BlanketWizard}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Navigation />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
