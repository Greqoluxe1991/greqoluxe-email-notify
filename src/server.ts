import express from "express";
import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://www.greqoluxe.com", "https://greqoluxe.myshopify.com"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,  // Allow cookies and credentials if needed
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  from: process.env.EMAIL_USER,
});

app.post("/send-email", async (req: Request, res: Response) => {
  const {to:process.env.EMAIL_TO , subject, text, html } = req.body;
  try {
    await transporter.sendMail({
      from: `"GreqoLuxe" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    res.status(200).send({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: "Failed to send email", log: error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
