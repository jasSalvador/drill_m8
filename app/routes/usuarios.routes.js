import express from "express";
import { emitToken } from "../middlewares/auth.middleware.js";
import {
    createUser, login, findUserById, findAll, updateUserById, changesStatus, deleteUserById
} from "../controllers/user.controller.js";
import { validateEmail } from "../middlewares/verifySignUp.js";

const router = express.Router();

router.get("/", findAll);
router.post("/", createUser);
router.post("/login", validateEmail, emitToken, login);
router.get("/:id", findUserById);
router.put("/:id", updateUserById);
router.delete("/:id", changesStatus); // soft-deletes
router.delete("/destroy/:id", deleteUserById);


export default router;