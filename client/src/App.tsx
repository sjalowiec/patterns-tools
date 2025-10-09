import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NecklineWizard from "@/pages/NecklineWizard";
import NecklineShapingWizard from "@/pages/NecklineShapingWizard";
import BlanketWizard from "@/pages/BlanketWizard";
import RectangleWizard from "@/pages/RectangleWizard";
import SleeveWizard from "@/pages/SleeveWizard";
import BoatNeckWizard from "@/pages/BoatNeckWizard";
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
        <Link
          href="/"
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
        </Link>
        <Link
          href="/neckline-shaping"
          data-testid="link-neckline-shaping-wizard"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            backgroundColor: location === '/neckline-shaping' ? 'rgba(255,255,255,0.2)' : 'transparent',
            transition: 'background-color 0.2s',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            if (location !== '/neckline-shaping') {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (location !== '/neckline-shaping') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          Neckline Shaping
        </Link>
        <Link
          href="/blanket"
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
        </Link>
        <Link
          href="/rectangle"
          data-testid="link-rectangle-wizard"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            backgroundColor: location === '/rectangle' ? 'rgba(255,255,255,0.2)' : 'transparent',
            transition: 'background-color 0.2s',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            if (location !== '/rectangle') {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (location !== '/rectangle') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          Rectangle/Square
        </Link>
        <Link
          href="/sleeve"
          data-testid="link-sleeve-wizard"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            backgroundColor: location === '/sleeve' ? 'rgba(255,255,255,0.2)' : 'transparent',
            transition: 'background-color 0.2s',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            if (location !== '/sleeve') {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (location !== '/sleeve') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          Sleeve Tester
        </Link>
        <Link
          href="/boat-neck"
          data-testid="link-boat-neck-wizard"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            backgroundColor: location === '/boat-neck' ? 'rgba(255,255,255,0.2)' : 'transparent',
            transition: 'background-color 0.2s',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            if (location !== '/boat-neck') {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (location !== '/boat-neck') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          Boat Neck
        </Link>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={NecklineWizard}/>
      <Route path="/neckline-shaping" component={NecklineShapingWizard}/>
      <Route path="/blanket" component={BlanketWizard}/>
      <Route path="/rectangle" component={RectangleWizard}/>
      <Route path="/sleeve" component={SleeveWizard}/>
      <Route path="/boat-neck" component={BoatNeckWizard}/>
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
        {/* Only show navigation in development mode */}
        {import.meta.env.DEV && <Navigation />}
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
