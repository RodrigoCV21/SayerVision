import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-moss/5 pointer-events-none rounded-3xl" />
        
        <div className="glass-card rounded-3xl p-8 text-center space-y-6 relative">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-accent" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-xl font-semibold text-foreground">Página no encontrada</h2>
            <p className="text-muted-foreground text-sm">
              Lo sentimos, no pudimos encontrar la página que estás buscando. 
              Es posible que haya sido movida o eliminada.
            </p>
          </div>

          <div className="pt-4">
            <Link 
              to="/" 
              className="btn-process w-full flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
