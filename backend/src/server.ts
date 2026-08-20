import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import userRoutes from "./routes/user.routes.js";
import { health, version } from "./controllers/system.controller.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json());

app.get("/health", health);
app.get("/version", version);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});
