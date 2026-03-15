import { Router, type IRouter } from "express";
import healthRouter from "./health";
import populationRouter from "./population";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/population", populationRouter);

export default router;
