"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  Building2,
  CalendarClock,
  Paperclip,
  Search,
  Send,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mutate } from "@/lib/client-api";
import {
  companyHref,
  initialsOf,
  logoClass,
  relativeTime,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MessageThread, MessageThreadDetail } from "@/types/api";

export function MessageCenter({
  threads,
  initialThread,
  viewerId,
}: {
  threads: MessageThread[];
  initialThread: MessageThreadDetail | null;
  viewerId: string;
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(initialThread?.id ?? threads[0]?.id);
  const [detail, setDetail] = useState(initialThread);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const visible = threads.filter((thread) =>
    `${thread.company.name} ${thread.subject}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const active = threads.find((thread) => thread.id === activeId) ?? threads[0];

  const open = async (id: string) => {
    setActiveId(id);
    const next = await fetch(`/api/hireloop/messages/${id}`).then((r) => r.json());
    setDetail(next.data as MessageThreadDetail);
    router.refresh();
  };

  const send = async () => {
    const body = draft.trim();
    if (!body || !active) return;

    setSending(true);
    await mutate(`/messages/${active.id}/messages`, "POST", { body });
    const next = await fetch(`/api/hireloop/messages/${active.id}`).then((r) =>
      r.json(),
    );
    setDetail(next.data as MessageThreadDetail);
    setDraft("");
    setSending(false);
    router.refresh();
    toast(`Sent to ${active.company.name}`);
  };

  if (!active) {
    return (
      <p className="rounded-xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
        No conversations yet. Recruiters who write to you land here.
      </p>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
      <Card className="lg:sticky lg:top-18">
        <CardContent className="grid gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messages"
              className="h-8 pl-8"
              aria-label="Search messages"
            />
          </div>

          <div className="grid gap-1">
            {visible.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No conversations match that search.
              </p>
            ) : (
              visible.map((thread) => (
                <ThreadRow
                  key={thread.id}
                  thread={thread}
                  active={thread.id === active.id}
                  onSelect={() => open(thread.id)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap items-start gap-3 border-b pb-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-semibold",
                logoClass(active.company.id)
              )}
              aria-hidden
            >
              {initialsOf(active.company.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-medium">{active.subject}</p>
              <p className="text-sm text-muted-foreground">
                <Link
                  href={companyHref(active.company)}
                  className="rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {active.company.name}
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Star thread"
                aria-pressed={active.starredByCandidate}
                onClick={async () => {
                  await mutate(`/messages/${active.id}`, "PATCH", {
                    starred: !active.starredByCandidate,
                  });
                  router.refresh();
                }}
              >
                <Star
                  className={cn(
                    active.starredByCandidate && "fill-chart-2 text-chart-2"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Archive thread"
                onClick={async () => {
                  await mutate(`/messages/${active.id}`, "PATCH", { archived: true });
                  router.refresh();
                  toast(`Archived the thread with ${active.company.name}`);
                }}
              >
                <Archive />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={companyHref(active.company)}>
                  <Building2 />
                  Company
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {(detail?.messages ?? []).map((message) => {
              const mine = message.senderId === viewerId;
              return (
                <div
                  key={message.id}
                  className={cn("flex gap-2.5", mine && "flex-row-reverse")}
                >
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback className="bg-muted text-[10px] font-medium">
                      {initialsOf(message.sender?.name ?? active.company.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-prose rounded-xl px-3 py-2 text-sm",
                      mine ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                  >
                    <p>{message.body}</p>
                    <p
                      className={cn(
                        "mt-1 font-mono text-[10px] tabular-nums",
                        mine ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {relativeTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="grid gap-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  send();
                }
              }}
              rows={3}
              placeholder={`Reply to ${active.company.name}…`}
              aria-label="Reply"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast("Attach a file up to 10 MB")}
              >
                <Paperclip />
                Attach
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDraft(
                    (prev) =>
                      prev ||
                      "Would any of these work?\n\n· Thursday 14:00\n· Friday 10:30\n· Monday 16:00",
                  )
                }
              >
                <CalendarClock />
                Propose a time
              </Button>
              <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                Ctrl + Enter to send
              </span>
              <Button
                size="sm"
                className="ml-auto"
                onClick={send}
                disabled={draft.trim().length === 0 || sending}
              >
                <Send />
                {sending ? "Sending…" : "Send"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ThreadRow({
  thread,
  active,
  onSelect,
}: {
  thread: MessageThread;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active}
      className={cn(
        "grid gap-1 rounded-lg px-2 py-2 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        active ? "bg-muted" : "hover:bg-muted/60"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md font-heading text-[10px] font-semibold",
            logoClass(thread.company.id)
          )}
          aria-hidden
        >
          {initialsOf(thread.company.name)}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {thread.company.name}
        </span>
        {thread.starredByCandidate && (
          <Star className="size-3 shrink-0 fill-chart-2 text-chart-2" />
        )}
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">
          {relativeTime(thread.lastMessageAt)}
        </span>
      </div>
      <p className="truncate text-xs font-medium">{thread.subject}</p>
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {thread.preview}
        </p>
        {thread.unread > 0 && (
          <Badge className="shrink-0 bg-chart-4/15 font-mono text-chart-4">
            {thread.unread}
          </Badge>
        )}
      </div>
    </button>
  );
}
