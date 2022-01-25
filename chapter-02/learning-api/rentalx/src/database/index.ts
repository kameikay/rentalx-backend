import { createConnection, getConnectionOptions } from "typeorm"
import { Category } from "../modules/cars/entities/Category";

interface IOptions {
  host: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  newOptions.host = 'database';
  createConnection({
    ...options,
    entities: [
      Category
    ]
  })
})