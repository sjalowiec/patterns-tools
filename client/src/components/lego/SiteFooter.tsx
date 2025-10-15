import { useEffect, useState } from 'react';

/**
 * SiteFooter - Fetches and displays the KnitbyMachine site footer
 * Only visible on screen, hidden in print/PDF output
 */
export function SiteFooter() {
  const [footerHtml, setFooterHtml] = useState<string>('');
  const [error, setError] = useState<string>('');

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

  if (error) {
    return null;
  }

  return (
    <div 
      className="no-print" 
      dangerouslySetInnerHTML={{ __html: footerHtml }}
      data-testid="site-footer"
    />
  );
}
