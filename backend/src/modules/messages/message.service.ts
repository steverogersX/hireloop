import { and, asc, count, desc, eq, isNull, ne, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { companies, messageThreads, messages } from "@/db/schema";
import { ApiError } from "@/utils/ApiError";
import { buildMeta } from "@/utils/ApiResponse";
import type {
  ListThreadsQuery,
  SendMessageInput,
  StartThreadInput,
  UpdateThreadInput,
} from "./message.schema";

async function requireParticipant(threadId: string, userId: string) {
  const thread = await db.query.messageThreads.findFirst({
    where: eq(messageThreads.id, threadId),
    with: { company: true },
  });
  if (!thread) throw ApiError.notFound("Conversation not found");

  const isCandidate = thread.candidateId === userId;
  const isEmployer = thread.company.ownerId === userId;
  if (!isCandidate && !isEmployer) throw ApiError.forbidden();

  return { thread, isCandidate };
}

export async function listThreads(userId: string, query: ListThreadsQuery) {
  const owned = await db.query.companies.findFirst({ where: eq(companies.ownerId, userId) });

  const scope = owned
    ? or(eq(messageThreads.candidateId, userId), eq(messageThreads.companyId, owned.id))
    : eq(messageThreads.candidateId, userId);

  const filters: SQL[] = [scope!];
  if (query.starred) filters.push(eq(messageThreads.starredByCandidate, true));
  const where = and(...filters);

  const [items, [totals]] = await Promise.all([
    db.query.messageThreads.findMany({
      where,
      with: {
        company: true,
        candidate: { columns: { id: true, name: true, headline: true } },
        messages: { orderBy: desc(messages.createdAt), limit: 1 },
      },
      orderBy: desc(messageThreads.lastMessageAt),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(messageThreads).where(where),
  ]);

  const withUnread = await Promise.all(
    items.map(async (thread) => {
      const [unread] = await db
        .select({ value: count() })
        .from(messages)
        .where(
          and(
            eq(messages.threadId, thread.id),
            ne(messages.senderId, userId),
            isNull(messages.readAt),
          ),
        );

      return { ...thread, preview: thread.messages[0]?.body ?? "", unread: unread?.value ?? 0 };
    }),
  );

  return { items: withUnread, meta: buildMeta(query.page, query.limit, totals?.value ?? 0) };
}

export async function getThread(userId: string, threadId: string) {
  const { thread } = await requireParticipant(threadId, userId);

  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(
      and(eq(messages.threadId, threadId), ne(messages.senderId, userId), isNull(messages.readAt)),
    );

  const items = await db.query.messages.findMany({
    where: eq(messages.threadId, threadId),
    with: { sender: { columns: { id: true, name: true, role: true } } },
    orderBy: asc(messages.createdAt),
  });

  return { ...thread, messages: items };
}

export async function startThread(userId: string, input: StartThreadInput) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, input.companyId),
  });
  if (!company) throw ApiError.notFound("Company not found");

  return db.transaction(async (tx) => {
    const [thread] = await tx
      .insert(messageThreads)
      .values({
        subject: input.subject,
        candidateId: userId,
        companyId: input.companyId,
        jobId: input.jobId ?? null,
      })
      .returning();

    await tx.insert(messages).values({
      threadId: thread!.id,
      senderId: userId,
      body: input.body,
    });

    return thread!;
  });
}

export async function sendMessage(userId: string, threadId: string, input: SendMessageInput) {
  await requireParticipant(threadId, userId);

  return db.transaction(async (tx) => {
    const [message] = await tx
      .insert(messages)
      .values({ threadId, senderId: userId, body: input.body })
      .returning();

    await tx
      .update(messageThreads)
      .set({ lastMessageAt: new Date() })
      .where(eq(messageThreads.id, threadId));

    return message!;
  });
}

export async function updateThread(
  userId: string,
  threadId: string,
  input: UpdateThreadInput,
) {
  const { isCandidate } = await requireParticipant(threadId, userId);
  if (!isCandidate) throw ApiError.forbidden("Only the candidate can star or archive");

  const [thread] = await db
    .update(messageThreads)
    .set({
      ...(input.starred !== undefined && { starredByCandidate: input.starred }),
      ...(input.archived !== undefined && { archivedByCandidate: input.archived }),
    })
    .where(eq(messageThreads.id, threadId))
    .returning();

  return thread!;
}

export async function unreadCount(userId: string) {
  const [row] = await db
    .select({ value: count() })
    .from(messages)
    .innerJoin(messageThreads, eq(messages.threadId, messageThreads.id))
    .where(
      and(
        eq(messageThreads.candidateId, userId),
        ne(messages.senderId, userId),
        isNull(messages.readAt),
      ),
    );

  return row?.value ?? 0;
}

export type ThreadList = Awaited<ReturnType<typeof listThreads>>;
export type ThreadDetail = Awaited<ReturnType<typeof getThread>>;
