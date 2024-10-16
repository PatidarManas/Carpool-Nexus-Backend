import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRoutes } from "./routes/UserRoutes.js";
import { config } from "dotenv";
import { MapRouter } from "./routes/MapRoutes.js";
import { rideRouter } from "./routes/RideRoute.js";


config();

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

export const connectDB = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected with ${connection.host}`);
};
connectDB();


app.use("/v1/api/auth",userRoutes)
app.use("/v1/api/places",MapRouter)
app.use("/v1/api/rides",rideRouter)

app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is working on port: ${port}`);
});

export default app;