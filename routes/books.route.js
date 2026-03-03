import express from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import {
  handleBookStoreController,
  handleBookListController,
  handleBookDeleteController,
  handleBookupdateController,
  handleBookFilterController,
} from "../controller/book.controller.js";

import upload from "../middleware/multer.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management APIs
 */

/* ================================================= */
/* ================= IMAGE UPLOAD ================== */
/* ================================================= */

/**
 * @swagger
 * /book/upload:
 *   post:
 *     summary: Upload book image
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/upload",
  auth,
  authorizeRoles("Admin", "User"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "books" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      res.json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================================================= */
/* ================= GET BOOKS ===================== */
/* ================================================= */

/**
 * @swagger
 * /book/booklists:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/booklists", auth, handleBookListController);

/* ================================================= */
/* ================= FILTER BOOKS ================== */
/* ================================================= */

/**
 * @swagger
 * /book/filter:
 *   get:
 *     summary: Filter books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by book title
 *     responses:
 *       200:
 *         description: Filtered books
 *       401:
 *         description: Unauthorized
 */
router.get("/filter", auth, handleBookFilterController);

/* ================================================= */
/* ================= ADD BOOK ====================== */
/* ================================================= */

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  auth,
  authorizeRoles("Admin", "User"),
  handleBookStoreController
);

/* ================================================= */
/* ================= UPDATE BOOK =================== */
/* ================================================= */

/**
 * @swagger
 * /book/updatebook:
 *   put:
 *     summary: Update book details (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/updatebook",
  auth,
  authorizeRoles("Admin"),
  handleBookupdateController
);

/* ================================================= */
/* ================= DELETE BOOK =================== */
/* ================================================= */

/**
 * @swagger
 * /book/deletebook:
 *   post:
 *     summary: Delete a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/deletebook",
  auth,
  authorizeRoles("Admin"),
  handleBookDeleteController
);

export default router;