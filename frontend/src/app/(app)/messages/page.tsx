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
import { getProfile, getThread, getThreads } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages — HireLoop",
  description: "Conversations with recruiters and hiring managers.",
};

export default async function MessagesPage() {
  const [threads, profile] = await Promise.all([getThreads(), getProfile()]);
  const first = threads[0] ? await getThread(threads[0].id) : null;
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
          <span className="font-mono text-foreground tabular-nums">{unread}</span>{" "}
          unread across{" "}
          <span className="font-mono text-foreground tabular-nums">
            {threads.length}
          </span>{" "}
          conversations.
        </p>
      </header>

      <MessageCenter
        threads={threads}
        initialThread={first}
        viewerId={profile?.user.id ?? ""}
      />
    </div>
  );
}
