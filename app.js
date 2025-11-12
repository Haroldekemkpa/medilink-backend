import express from "express";
import router from "./routes/userRoutes.js";

// import endpoint
import userRouter from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
const PORT = 3000;

// mount endpoints
app.use("/api/")

app.use("/api/user", router);

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});
