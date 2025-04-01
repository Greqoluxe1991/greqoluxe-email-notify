import express from "express";
import cors from "cors";
import emailRoutes from "./routes/email-routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/email", emailRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
