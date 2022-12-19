import express from "express";

import bodyParser from "body-parser";

const app = express();

import todosRoutes from "./routes/todos";

app.use(bodyParser.json());

app.use(todosRoutes);

app.listen(3000);
