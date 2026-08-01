import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import savingsRouter from "./savings";
import tribesRouter from "./tribes";
import dashboardRouter from "./dashboard";
import waitlistRouter from "./waitlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use(savingsRouter);
router.use(tribesRouter);
router.use(dashboardRouter);
router.use(waitlistRouter);

export default router;
