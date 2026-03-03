import express from "express";
import cors from "cors";
import connectDB from "./database.js";
import bookRouter from "./routes/books.route.js";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import morgan, { format } from "morgan";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173","https://book-management-frontend-astha.vercel.app"],   // your Vite frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("REQUEST HIT:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/book", bookRouter);

// 1. Define Swagger Options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Standard OpenAPI version
    info: {
      title: "Book Management",
      version: "1.0.0",
      description: "API documentation for my MERN application",
      contact: {
        name: "Astha",
      },
    },
    servers: [
      {
        url: `http://localhost:5000`, // Your backend URL
        description: "Development server",
      },
      {
        url: `https://book-management-backend-keq0.onrender.com`, // Your backend URL
        description: "Deployed server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // 2. Point to the files where you will write your API comments
  apis: ["./routes/*.js"],
};

// 3. Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// 4. Setup the Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
