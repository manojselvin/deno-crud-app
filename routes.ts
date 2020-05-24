import { Router } from "https://deno.land/x/oak/mod.ts";

import {
    fetchAllUsers,
    // createUser,
    // fetchOneUser,
    // updateUser,
    // deleteUser,
  } from "./controllers/users.ts";

const router = new Router();

router.get('/users', fetchAllUsers);

export default router;