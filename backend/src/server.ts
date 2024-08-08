import express from 'express';
import cors from "cors";
import { router } from './routers/index';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error-handler.middleware';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/", router);
app.use(errorHandler)

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});