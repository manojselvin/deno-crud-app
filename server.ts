import { Application } from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import { ErrorMiddleware } from "./utils/middlewares/index.ts";
import {
    fetchAllUsers,
    createUser,
    fetchOneUser,
    updateUser,
    deleteUser,
  } from "./controllers/users.ts";

const app = new Application();

app.use(ErrorMiddleware);
app.get('/users', fetchAllUsers)
  .get('/users/:id', fetchOneUser)
  .post('/users', createUser)
  .put('/users', updateUser)
  .delete('/users', deleteUser)
  .start({ port: 5000 });

console.log(`server listening on http://localhost:5000`);




