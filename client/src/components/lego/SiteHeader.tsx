import { useEffect, useState } from 'react';

/**
 * SiteHeader - Fetches and displays the KnitbyMachine site header
 * Only visible on screen, hidden in print/PDF output
 */
export function SiteHeader() {
  const [headerHtml, setHeaderHtml] = useState<string>('');
  const [error, setError] = useState<string>('');

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

  if (error) {
    return null;
  }

  return (
    <div 
      className="no-print" 
      dangerouslySetInnerHTML={{ __html: headerHtml }}
      data-testid="site-header"
    />
  );
}
