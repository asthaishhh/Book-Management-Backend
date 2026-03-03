import Book from "../model/book.model.js";
import cloudinary from "../config/cloudinary.js";
import {auth} from "../middleware/auth.js"

const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    );

    res.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleBookStoreController = async (req, res) => {
  try {
    const { BookName, Author, Price, Category, Image } = req.body;

    if (!BookName || !Author || Price == null || !Category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const bookAdd = await Book.create({
      BookName,
      Author,
      Price,
      Category,
      Image,
    });
    if (bookAdd) {
      res
        .status(201)
        .json({ Message: "Data successfully added", Success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleBookListController = async (req, res) => {
  try {
    const bookList = await Book.find({});
    return res.status(200).json({
      Message: "All books fetched successfully",
      Success: true,
      TotalCount: bookList.length,
      Booklist: bookList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleBookDeleteController = async (req, res) => {
  const body = req.body;

  try {
    const deleted = await Book.deleteOne({ _id: body._id });
    console.log("deleted", deleted);
    if (deleted.deletedCount > 0) {
      return res.json({
        Message: "book deleted successfully",
        Success: true,
      });
    } else {
      return res.status(404).json({
        Message: "book not found",
        Success: false,
      });
    }
  } catch (error) {
    return res.status(400).json({ Message: error.message, Success: false });
  }
};

const handleBookupdateController = async (req, res) => {
  if (req.user.role !== "Admin" && Book.createdBy.toString() !== req.user.id) {
  return res.status(403).json({ msg: "Not allowed" });
}
  try {
    const body = req.body;
    const updating = await Book.updateOne({ _id: body._id }, { $set: body });
    console.log(updating);

    if (updating?.acknowledged) {
      return res.json({
        Message: "book updated successfully",
        Success: true,
      });
    } else {
      return res.status(404).json({
        Message: "book not found",
        Success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      Message: error.message,
      Success: false,
    });
  }
};

const handleBookFilterController = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    let filter = {};

    // Filter by category
    if (category) {
      filter.Category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.Price = {};

      if (minPrice) {
        filter.Price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.Price.$lte = Number(maxPrice);
      }
    }

    const filteredBooks = await Book.find(filter);

    return res.status(200).json({
      Message: "Filtered books fetched successfully",
      Success: true,
      TotalCount: filteredBooks.length,
      Booklist: filteredBooks,
    });
  } catch (error) {
    return res.status(500).json({
      Message: error.message,
      Success: false,
    });
  }
};
export {
  handleBookStoreController,
  handleBookListController,
  handleBookDeleteController,
  handleBookupdateController,
  uploadImage,
  handleBookFilterController,
};
