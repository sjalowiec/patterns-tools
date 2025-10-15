import { useEffect, useState, useRef } from 'react';

/**
 * SiteHeader - Fetches and displays the KnitbyMachine site header
 * Only visible on screen, hidden in print/PDF output
 * Re-executes all script tags to enable dropdowns and interactive features
 */
export function SiteHeader() {
  const [headerHtml, setHeaderHtml] = useState<string>('');
  const [error, setError] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://kbm-global.netlify.app/header.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load header');
        return response.text();
      })
      .then(html => setHeaderHtml(html))
      .catch(err => {
        console.error('Error loading site header:', err);
        setError('Could not load site header');
      });
  }, []);

  // Re-execute scripts after HTML is inserted
  useEffect(() => {
    if (headerHtml && containerRef.current) {
      const container = containerRef.current;
      const scripts = container.querySelectorAll('script');
      
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        
        // Copy all attributes
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy script content
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        
        // Replace old script with new one to trigger execution
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [headerHtml]);

  if (error) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="no-print" 
      dangerouslySetInnerHTML={{ __html: headerHtml }}
      data-testid="site-header"
    />
  );
}
