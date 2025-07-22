// src/pages/auth/unauthorized.jsx
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom"; // or your routing library

export function UnauthorizedPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
            <div className="text-center max-w-md mx-auto space-y-6 animate-fade-in">
                <div className="flex justify-center">
                    <div className="p-4 bg-destructive/10 rounded-full">
                        <LockKeyhole className="h-12 w-12 text-destructive" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Access Denied
                    </h1>
                    <p className="text-muted-foreground">
                        You don't have permission to view this page. Please contact your administrator or sign in with a different account.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                    <Button asChild variant="outline">
                        <Link to="/">
                            Return Home
                        </Link>
                    </Button>
                    <Button asChild variant="destructive">
                        <Link to="/login">
                            Sign In
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}