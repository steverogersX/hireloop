"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Send } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { threads } from "@/lib/recruiter-mock-data";

export function MessageInbox() {
  const [activeId, setActiveId] = useState(threads[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const visible = threads.filter((thread) =>
    `${thread.name} ${thread.role} ${thread.preview}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const active = threads.find((thread) => thread.id === activeId) ?? threads[0];

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-2 px-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
              className="h-8 pl-8"
              aria-label="Search conversations"
            />
          </div>

          <ScrollArea className="h-[28rem]">
            <div className="grid gap-1 pr-2">
              {visible.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                  No conversations match.
                </p>
              ) : (
                visible.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveId(thread.id)}
                    aria-current={thread.id === active.id}
                    className={cn(
                      "grid gap-1 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      thread.id === active.id
                        ? "bg-muted"
                        : "hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback
                          className={cn(
                            "text-[11px] font-medium",
                            thread.avatarClass
                          )}
                        >
                          {thread.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                          {thread.name}
                          {thread.unread && (
                            <span
                              className="size-1.5 shrink-0 rounded-full bg-chart-4"
                              aria-label="Unread"
                            />
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {thread.role}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">
                        {thread.when}
                      </span>
                    </div>
                    <p className="line-clamp-2 pl-10.5 text-xs text-muted-foreground">
                      {thread.preview}
                    </p>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2.5 border-b pb-3">
            <Avatar className="size-9">
              <AvatarFallback
                className={cn("text-xs font-medium", active.avatarClass)}
              >
                {active.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{active.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {active.role}
              </p>
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              {active.messages.length} messages
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/recruiter/applicants/${active.candidateId}`}>
                Open profile
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>

          <ScrollArea className="h-80">
            <div className="grid gap-3 pr-3">
              {active.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "grid max-w-[80%] gap-1 rounded-xl px-3 py-2",
                    message.from === "us"
                      ? "justify-self-end bg-primary/10"
                      : "justify-self-start bg-muted"
                  )}
                >
                  <p className="flex items-baseline gap-2 text-xs font-medium">
                    {message.author}
                    <span className="font-mono font-normal text-muted-foreground tabular-nums">
                      {message.when}
                    </span>
                  </p>
                  <p className="text-sm leading-relaxed">{message.body}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="grid gap-2 border-t pt-3">
            <Textarea
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Reply to ${active.name.split(" ")[0]}…`}
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                disabled={draft.trim().length === 0}
                onClick={() => {
                  setDraft("");
                  toast.success(`Reply sent to ${active.name}`);
                }}
              >
                <Send />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
