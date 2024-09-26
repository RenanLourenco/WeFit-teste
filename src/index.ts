import "reflect-metadata"
import 'express-async-errors'
import express from "express";
import cors from "cors";
import { AppDataSource } from "./infra/data-source";
import { routes } from "./routes/routes";
import { errorMiddleware } from "./middlewares/error";
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs";
import * as path from "path";

AppDataSource.initialize().then(() => {
  const app = express();

  const port = process.env.PORT || 4568;

  app.use(cors())
  app.use(express.json())
  const swaggerPath = path.resolve(__dirname, 'swagger.yml');
  const swaggerDocument = YAML.load(swaggerPath);

  //@ts-ignore
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(routes)
  app.use(errorMiddleware)

  app.get("/ping", (req, res) => {
    return res.send("pong");
  });

  app.listen(port, () => {
    console.log(`Escutando na porta ${port}`);
  });

})

