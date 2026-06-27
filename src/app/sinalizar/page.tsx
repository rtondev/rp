import { Suspense } from "react";
import { Spin } from "@/components/ui/Spin";
import { NovoSinalContent } from "@/components/signals/NovoSinalContent";

export default function NovoSinalPage() {
  return (
    <Suspense fallback={<Spin className="py-16" />}>
      <NovoSinalContent />
    </Suspense>
  );
}
