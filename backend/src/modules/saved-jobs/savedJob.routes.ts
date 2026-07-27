import { Router } from "express";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import * as controller from "./savedJob.controller";
import {
  listSavedJobsQuerySchema,
  saveJobSchema,
  savedJobParamSchema,
} from "./savedJob.schema";

export const savedJobRouter = Router();

savedJobRouter.use(requireAuth);

savedJobRouter.get("/", validate({ query: listSavedJobsQuerySchema }), controller.list);
savedJobRouter.post("/", validate({ body: saveJobSchema }), controller.save);
savedJobRouter.delete("/:jobId", validate({ params: savedJobParamSchema }), controller.remove);
