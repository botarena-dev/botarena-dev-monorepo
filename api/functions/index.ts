import express from "express";
import cors from "cors";

import loadRoutesWithPriorityOrder from "@/loaders/loadRoutesWithPriorityOrder";

const app = express();

app.use(cors());
app.use(express.json());

loadRoutesWithPriorityOrder(app).catch((error) =>
  console.error("Error loading routes with priority order:", error),
);

app.listen(3000, () => {});
