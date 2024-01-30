import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1>Page Not Found</h1>
      <Link href="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}
