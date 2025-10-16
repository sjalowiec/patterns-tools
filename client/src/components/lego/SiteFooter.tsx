import { useEffect, useState, useRef } from 'react';

/**
 * SiteFooter - Fetches and displays the KnitbyMachine site footer
 * Only visible on screen, hidden in print/PDF output
 * Re-executes all script tags to enable interactive features
 */
export function SiteFooter() {
  const [footerHtml, setFooterHtml] = useState<string>('');
  const [error, setError] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://kbm-global.netlify.app/footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load footer');
        return response.text();
      })
      .then(html => setFooterHtml(html))
      .catch(err => {
        console.error('Error loading site footer:', err);
        setError('Could not load site footer');
      });
  }, []);

  // Re-execute scripts after HTML is inserted
  useEffect(() => {
    if (footerHtml && containerRef.current) {
      const container = containerRef.current;
      const scripts = container.querySelectorAll('script');
      
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        
        // Copy all attributes
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy script content - wrap in IIFE to avoid global scope conflicts
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          // Wrap inline scripts in an IIFE to prevent variable redeclaration
          newScript.textContent = `(function() { ${oldScript.textContent} })();`;
        }
        
        // Replace old script with new one to trigger execution
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [footerHtml]);

  if (error) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="no-print" 
      dangerouslySetInnerHTML={{ __html: footerHtml }}
      data-testid="site-footer"
    />
  );
}
