import { Suspense } from "react";
import RoastClient from "./RoastClient";

export const dynamic = "force-dynamic";

export default function RoastPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <RoastClient />
    </Suspense>
  );
}
