import type { Metadata } from "next";
import Link from "next/link";

import { MessageCenter } from "@/components/messages/message-center";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { threads } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Messages — HireLoop",
  description: "Conversations with recruiters and hiring managers.",
};

export default function MessagesPage() {
  const unread = threads.reduce((sum, thread) => sum + thread.unread, 0);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Messages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="grid gap-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
          Messages
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground tabular-nums">
            {unread}
          </span>{" "}
          unread across{" "}
          <span className="font-mono text-foreground tabular-nums">
            {threads.length}
          </span>{" "}
          conversations. Recruiters see when you have read theirs.
        </p>
      </header>

      <MessageCenter />
    </div>
  );
}
