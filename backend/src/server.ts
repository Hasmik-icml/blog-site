import  express  from 'express';
import { menuRouter } from './routers/index';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use("/", menuRouter);


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});