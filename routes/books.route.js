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

/* ================================================= */
/* ================= IMAGE UPLOAD ================== */
/* Admin + User only                                */
/* ================================================= */

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
/* Any logged-in user                               */
/* ================================================= */

router.get(
  "/booklists",
  auth,
  handleBookListController
);

/* ================================================= */
/* ================= FILTER ======================== */
/* Any logged-in user                               */
/* ================================================= */

router.get(
  "/filter",
  auth,
  handleBookFilterController
);

/* ================================================= */
/* ================= ADD BOOK ====================== */
/* Admin + User                                     */
/* ================================================= */

router.post(
  "/",
  auth,
  authorizeRoles("Admin", "User"),
  handleBookStoreController
);

/* ================================================= */
/* ================= UPDATE BOOK =================== */
/* Admin only (recommended for safety)              */
/* ================================================= */

router.put(
  "/updatebook",
  auth,
  authorizeRoles("Admin"),
  handleBookupdateController
);

/* ================================================= */
/* ================= DELETE BOOK =================== */
/* Admin only                                       */
/* ================================================= */

router.post(
  "/deletebook",
  auth,
  authorizeRoles("Admin"),
  handleBookDeleteController
);

export default router;