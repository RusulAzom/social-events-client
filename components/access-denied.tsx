import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Please log in to access this page
        </h3>
        <p className="text-muted-foreground mb-4">
          You need to be signed in to view this content.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
