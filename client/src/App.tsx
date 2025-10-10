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
  
  const navLinks = [
    { href: '/', label: 'Neckline/Shoulder', testId: 'link-neckline-wizard' },
    { href: '/neckline-shaping', label: 'Neckline Shaping', testId: 'link-neckline-shaping-wizard' },
    { href: '/blanket', label: 'Blanket Pattern', testId: 'link-blanket-wizard' },
    { href: '/rectangle', label: 'Rectangle/Square', testId: 'link-rectangle-wizard' },
    { href: '/sleeve', label: 'Sleeve Tester', testId: 'link-sleeve-wizard' },
    { href: '/boat-neck', label: 'Boat Neck', testId: 'link-boat-neck-wizard' }
  ];
  
  return (
    <nav className="fixed top-2 left-2 bg-[var(--accent)] rounded-lg p-3 shadow-lg z-[1000] min-w-[180px] max-w-[200px]">
      <h2 className="text-white text-xs font-semibold mb-2 uppercase tracking-wide opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Dev Menu
      </h2>
      <div className="flex flex-col gap-1">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            data-testid={link.testId}
            className={`
              text-white no-underline px-3 py-2 rounded text-sm transition-colors
              ${location === link.href 
                ? 'bg-white/25 font-semibold' 
                : 'bg-transparent hover:bg-white/10 font-normal'}
            `}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {link.label}
          </Link>
        ))}
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
