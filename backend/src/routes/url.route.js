import express from "express";
import generateCode from "../utils/generateCode.js";
import UrlModel from "../models/url.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({
      error: "Please enter a URL",
    });
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return res.status(400).json({
      error: "Please enter a valid URL starting with http:// or https://",
    });
  }

  if (url.length > 2048) {
    return res.status(400).json({
      error: "URL is too long....",
    });
  }

  const code = generateCode();

  const newUrl = await UrlModel.create({
    orginalUrl: url,
    shortCode: code,
  });

  res.status(201).json({
    message: "URL shortened successfully",
    data: {
      orginalUrl: newUrl.orginalUrl,
      shortCode: newUrl.shortCode,
    },
  });
});

router.get("/", async (req, res) => {
  const urls = await UrlModel.find();

  res.status(200).json({
    message: "URLs fetched succesfully",
    data: {
      urls,
    },
  });
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  console.log(id);

  const url = await UrlModel.findById(id);

  if (!url) {
    return res.status(404).json({
      message: "URL not found",
    });
  }

  await UrlModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "URL deleted successfully",
  });
});

export default router;
