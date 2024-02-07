import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import {findChats,CreateChat,findUserChats} from '../controller/ChatController.js'
const chatRoute = Router();
chatRoute.post("/", CreateChat);
chatRoute.get("/userId", findUserChats);
chatRoute.get("/find/:firstId/:secondId", findChats)

export default chatRoute;