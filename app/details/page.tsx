'use client'
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/SkeletonCard";

// Dynamically import the client component (no SSR)
const DetailsContent = dynamic(
  () => import("./DetailContent"),
  { ssr: false } // <-- important: disables server rendering
);

export default function DetailsPage() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <DetailsContent />
    </Suspense>
  );
}
