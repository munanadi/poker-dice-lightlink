"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const { push } = useRouter();

  const handleClick = () => {
    push("/");
  };

  return (
    <div className="">
      <main className="">
        <h1>Page Not Found</h1>
        <Button onClick={handleClick}>Go back home</Button>
      </main>
    </div>
  );
}
