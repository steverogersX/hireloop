import type { Message, MessageThread } from "@/db/schema";
import type { IdParams } from "@/types/http";
import { created, paginated, success } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import * as messageService from "./message.service";
import type {
  ListThreadsQuery,
  SendMessageInput,
  StartThreadInput,
  UpdateThreadInput,
} from "./message.schema";

export const list = asyncHandler<
  messageService.ThreadList["items"],
  unknown,
  ListThreadsQuery
>(async (req, res) => {
  const result = await messageService.listThreads(req.user!.sub, req.query);
  return paginated(res, result, "Conversations fetched");
});

export const detail = asyncHandler<
  messageService.ThreadDetail,
  unknown,
  unknown,
  IdParams
>(async (req, res) => {
  const thread = await messageService.getThread(req.user!.sub, req.params.id);
  return success(res, thread, "Conversation fetched");
});

export const start = asyncHandler<MessageThread, StartThreadInput>(async (req, res) => {
  const thread = await messageService.startThread(req.user!.sub, req.body);
  return created(res, thread, "Message sent");
});

export const reply = asyncHandler<Message, SendMessageInput, unknown, IdParams>(
  async (req, res) => {
    const message = await messageService.sendMessage(req.user!.sub, req.params.id, req.body);
    return created(res, message, "Message sent");
  },
);

export const update = asyncHandler<MessageThread, UpdateThreadInput, unknown, IdParams>(
  async (req, res) => {
    const thread = await messageService.updateThread(req.user!.sub, req.params.id, req.body);
    return success(res, thread, "Conversation updated");
  },
);

export const unread = asyncHandler<{ unread: number }>(async (req, res) => {
  const value = await messageService.unreadCount(req.user!.sub);
  return success(res, { unread: value }, "Unread count fetched");
});
