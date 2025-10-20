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
import GaugeCalculatorWizard from "@/pages/GaugeCalculatorWizard";
import GaugeConversionWizard from "@/pages/GaugeConversionWizard";
import GaugeDifferenceWizard from "@/pages/GaugeDifferenceWizard";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();
  
  const navLinks = [
    { href: '/', label: 'Neckline/Shoulder', testId: 'link-neckline-wizard' },
    { href: '/neckline-shaping', label: 'Neckline Shaping', testId: 'link-neckline-shaping-wizard' },
    { href: '/blanket', label: 'Blanket Pattern', testId: 'link-blanket-wizard' },
    { href: '/rectangle', label: 'Rectangle/Square', testId: 'link-rectangle-wizard' },
    { href: '/sleeve', label: 'Sleeve Tester', testId: 'link-sleeve-wizard' },
    { href: '/boat-neck', label: 'Boat Neck', testId: 'link-boat-neck-wizard' },
    { href: '/gauge-calculator', label: 'Gauge Calculator', testId: 'link-gauge-calculator-wizard' },
    { href: '/gauge-conversion', label: 'Gauge Conversion', testId: 'link-gauge-conversion-wizard' },
    { href: '/gauge-difference', label: 'Gauge Difference', testId: 'link-gauge-difference-wizard' }
  ];
  
  return (
    <nav className="fixed top-2 left-2 bg-[var(--accent)] rounded-lg p-3 shadow-lg z-[1000]">
      <h2 className="text-white text-xs font-semibold mb-2 uppercase tracking-wide opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Dev Menu
      </h2>
      <div className="text-white text-sm" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '1.8' }}>
        {navLinks.map((link, index) => (
          <span key={link.href}>
            <Link
              href={link.href}
              data-testid={link.testId}
              className={`
                no-underline transition-colors
                ${location === link.href 
                  ? 'font-bold underline' 
                  : 'hover:underline font-normal'}
              `}
              style={{ color: 'white' }}
            >
              {link.label}
            </Link>
            {index < navLinks.length - 1 && (
              <>
                <span className="mx-2 opacity-50">|</span>
                {(index + 1) % 3 === 0 && <br />}
              </>
            )}
          </span>
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
      <Route path="/gauge-calculator" component={GaugeCalculatorWizard}/>
      <Route path="/gauge-conversion" component={GaugeConversionWizard}/>
      <Route path="/gauge-difference" component={GaugeDifferenceWizard}/>
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
