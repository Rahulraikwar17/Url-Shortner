import express from "express";
import urlRouter from "../routes/url.route.js";
import UrlModel from "../models/url.model.js";
const app = express();

app.use(express.json());

app.use("/api/url", urlRouter);

app.get("/:code", async (req, res) => {
  const { code } = req.params;

  const url = await UrlModel.findOne({ shortCode: code });

  if (!url) {
    return res.status(404).json({
      error: "URL not found",
    });
  }

  res.redirect(302, url.orginalUrl);

  await UrlModel.findOneAndUpdate(
    {
      shortCode: code,
    },
    {
      $inc: {
        clicks: 1,
      },
    },
  );
});

export default app;
