// pages/UnauthorizedPage.jsx
export function UnauthorizedPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground mt-2">You don't have permission to view this page.</p>
        </div>
    );
}
