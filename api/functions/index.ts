import express from "express";
import cors from "cors";

import loadRoutesWithPriorityOrder from "@/loaders/loadRoutesWithPriorityOrder";
import { errorHandler } from "@/errors/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

await loadRoutesWithPriorityOrder(app).catch((error) =>
  console.error("Error loading routes with priority order:", error),
);

app.use(errorHandler);

app.listen(3000, () => {});
