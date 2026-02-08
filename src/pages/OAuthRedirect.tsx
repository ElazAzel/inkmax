/**
 * OAuthRedirect - Handles /~oauth/* routes
 * These routes should be served by the Lovable Cloud infrastructure.
 * If React Router catches them (e.g., after SPA reload), we retry the navigation.
 */
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function OAuthRedirect() {
  useEffect(() => {
    // Force a full page reload to let the server handle the OAuth route
    // This happens when the SPA intercepts the route instead of the server
    const fullUrl = window.location.href;
    window.location.replace(fullUrl);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
