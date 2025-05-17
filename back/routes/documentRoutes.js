// routes/documentRoutes.js
const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../utils/asyncHandler");
const { pdfUpload } = require("../middleware/uploadMiddleware");
const documentService = require("../services/documentService");

router.post("/load-url", asyncHandler(async (req, res) => {
  const count = await documentService.processURL(req.body.url);
  res.json({ message: `${count} documents indexed` });
}));

router.post("/upload-pdf", pdfUpload.single("pdf"), asyncHandler(async (req, res) => {
  const count = await documentService.processPDF(req.file.path, req.file.originalname);
  res.json({ message: `${count} PDF pages indexed` });
}));

module.exports = router;