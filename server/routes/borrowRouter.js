import express from "express";
import { borrowedBooks, getBorrowedBooksForAdmin, recordBorrowedBook, returnBorrowedBook } from "../controllers/borrowContoller.js";
import { isAuthenticated, iSAuthorized } from "../Middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/record-borrow-book/:id",isAuthenticated,iSAuthorized("Admin"),recordBorrowedBook);
router.get("/borrowed-books-by-users",isAuthenticated,iSAuthorized("Admin"),getBorrowedBooksForAdmin);
router.get("/my-borrowed-books",isAuthenticated,borrowedBooks);
router.put("/retun-borrowed-book/:id",isAuthenticated,iSAuthorized("Admin"),returnBorrowedBook);

export default router;