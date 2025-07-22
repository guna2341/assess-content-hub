import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-white/80 mb-6">Oops! Page not found</p>
          <p className="text-white/60 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Button asChild variant="hero" size="lg">
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
