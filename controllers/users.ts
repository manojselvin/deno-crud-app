import { HandlerFunc, Context } from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import { ErrorHandler } from "../utils/middlewares/index.ts";
import { UserIF, userModel } from "../models/user.model.ts";

export const fetchAllUsers: HandlerFunc = async (c: Context) => {
    try {
        
        const users: UserIF[] = await userModel.find();
        if (users) {
            const list = users.length
              ? users.map((user) => {
                const { _id: { $oid }, name, age, phone } = user;
                return { id: $oid, name, age, phone };
              })
              : [];
            return c.json(list, 200);
        }
    } catch (error) {
        throw new ErrorHandler(error.message, error.status || 500);
    }
}

export const fetchOneUser = async (c: Context) => {
    try {
        const { id } = c.params as { id: string };
        const user = await userModel.findOne({ _id: { "$oid": id } });
        if (user) {
                const { _id: { $oid }, name, age, phone } = user;
            return c.json({ id: $oid, name, age, phone }, 200);
        }
    } catch (error) {
        throw new ErrorHandler(error.message, error.status || 500);
    }
}

export const createUser = async (c: Context) => {
    const body = await c.body();
    try {
        if (c.request.headers.get('content-type') !== 'application/json') {
            return new ErrorHandler("Invalid Body", 422);
        }

        if (!Object.keys(body).length) {
            throw new ErrorHandler("Request body can not be empty!", 400);
        }

        const { name, age, phone} = body;

        const insertedUser = await userModel.insertOne({
            name, age, phone
        });

        c.json(insertedUser, 201);
    } catch (error) {
        throw new ErrorHandler(error.message, error.status || 500);
    }
}

export const updateUser = async (c: Context) => {

    try {
        const { id } = c.params as { id: string };

        if (c.request.headers.get('content-type') !== 'application/json') {
            return new ErrorHandler("Invalid Body", 422);
        }

        const body = await (c.body()) as {
            name?: string;
            phone: string;
            age?: number;
          };

        if (!Object.keys(body).length) {
            throw new ErrorHandler("Request body can not be empty!", 400);
        }

        const fetchedUser = await userModel.findOne({ _id: { "$oid": id } });

        if (fetchedUser) {
          const { matchedCount } = await userModel.updateOne(
            { _id: { "$oid": id } },
            { $set: body },
          );
          if (matchedCount) {
            return c.string("User updated successfully!", 204);
          }
          return c.string("Unable to update user");
        }
        throw new ErrorHandler("User not found", 404);
    } catch (error) {
        throw new ErrorHandler(error.message, error.status || 500);
    }
}

export const deleteUser = async (c: Context) => {
    try {
        const { id } = c.params as { id: string };
    
        const fetchedUser = await userModel.findOne({ _id: { "$oid": id } });
    
        if (fetchedUser) {
          const deleteCount = await userModel.deleteOne({ _id: { "$oid": id } });
          if (deleteCount) {
            return c.string("User deleted successfully!", 204);
          }
          throw new ErrorHandler("Unable to delete user", 400);
        }
    
        throw new ErrorHandler("User not found", 404);
    } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500);
    }
}