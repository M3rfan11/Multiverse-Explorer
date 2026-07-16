"use client";

// Temporary visual QA page — delete before submission.
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";

export default function DesignPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-white">
        Design system QA
      </h1>

      <section className="flex flex-wrap items-center gap-3">
        <StatusBadge status="Alive" />
        <StatusBadge status="Dead" />
        <StatusBadge status="unknown" />
        <StatusBadge status="Alive" size="md" />
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
        <Spinner />
      </section>

      <section className="flex gap-3">
        <Input placeholder="Search characters…" />
        <Select
          className="w-44"
          options={[
            { value: "", label: "Any status" },
            { value: "alive", label: "Alive" },
            { value: "dead", label: "Dead" },
          ]}
        />
      </section>

      <Card className="p-6">
        <p className="text-sm text-slate-300">Glass card surface</p>
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-24 w-24" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </Card>

      <Card>
        <EmptyState
          title="No characters found in this dimension"
          description="Try clearing the filters."
          actionLabel="Clear filters"
          onAction={() => alert("clear")}
        />
      </Card>

      <Card>
        <ErrorState onRetry={() => alert("retry")} />
      </Card>
    </main>
  );
}
