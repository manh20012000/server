import { Router } from "express";
import Notification from "../model/Notification";
import protectRoute from "../middlewere/protectRoute";
const notifiCation = Router();

notifiCation.get("/getnotification", protectRoute, async (req, res) => {
   const user=req.user
   


});
export default notifiCation;
