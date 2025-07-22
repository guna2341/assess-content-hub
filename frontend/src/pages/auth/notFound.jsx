import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="mt-4 text-xl font-semibold">Page Not Found</p>
            <p className="mt-2 text-center text-muted-foreground">
                Sorry, the page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-6 inline-block px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
                Go to Home
            </Link>
        </div>
    );
}
