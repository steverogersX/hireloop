import { Router } from "express";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./message.controller";
import {
  listThreadsQuerySchema,
  sendMessageSchema,
  startThreadSchema,
  threadIdParamSchema,
  updateThreadSchema,
} from "./message.schema";

export const messageRouter = Router();

messageRouter.use(requireAuth);

messageRouter.get("/", validate({ query: listThreadsQuerySchema }), controller.list);
messageRouter.get("/unread", controller.unread);
messageRouter.post("/", validate({ body: startThreadSchema }), controller.start);
messageRouter.get("/:id", validate({ params: threadIdParamSchema }), controller.detail);
messageRouter.post(
  "/:id/messages",
  validate({ params: threadIdParamSchema, body: sendMessageSchema }),
  controller.reply,
);
messageRouter.patch(
  "/:id",
  validate({ params: threadIdParamSchema, body: updateThreadSchema }),
  controller.update,
);
