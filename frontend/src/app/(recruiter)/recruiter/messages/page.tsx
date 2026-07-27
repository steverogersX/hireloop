import type { Metadata } from "next";
import Link from "next/link";

import { MessageInbox } from "@/components/recruiter/message-inbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { threads } from "@/lib/recruiter-mock-data";

export const metadata: Metadata = {
  title: "Messages — HireLoop",
  description: "Conversations with candidates in your pipelines.",
};

export default function MessagesPage() {
  const unread = threads.filter((thread) => thread.unread).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/recruiter">Overview</Link>
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
          {threads.length} conversations
          {unread > 0 && ` · ${unread} waiting on your reply`}
        </p>
      </header>

      <MessageInbox />
    </div>
  );
}
