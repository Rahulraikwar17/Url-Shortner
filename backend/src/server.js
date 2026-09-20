import app from "./app/app.js";
import { connectDb } from "./config/db.js";

await connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
