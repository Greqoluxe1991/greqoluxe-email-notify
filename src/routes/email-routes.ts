import { Router } from "express";
import { sendEmailToGreqoluxe } from "../controllers/email-controllers";

const router = Router();

router.post("/", sendEmailToGreqoluxe);

export default router;
