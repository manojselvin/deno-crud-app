import db from '../config/db.ts';

interface UserIF {
  _id: {
    $oid: string;
  };
  name: string;
  age: number;
  phone: string;
}

const database = db.getDatabase;
const userModel = database.collection('users');

export { UserIF, userModel };