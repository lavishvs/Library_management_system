import { isAuthenticated, iSAuthorized } from "../Middlewares/authMiddlewares.js";
import { addBook,deleteBook,getAllBooks } from "../controllers/bookController.js";
import express from "express";


const router = express.Router();

router.post("/admin/add", isAuthenticated,iSAuthorized("Admin") ,addBook);
router.get("/all", isAuthenticated, getAllBooks);
router.delete("/delete/:id", isAuthenticated,iSAuthorized("Admin"),deleteBook);

export default router;  