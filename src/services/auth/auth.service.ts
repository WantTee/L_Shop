import { readJSON, writeJSON } from "../../utils/file.ts";
import type { User } from "../../types/user.ts";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERS_PATH = path.join(__dirname, "../../../database/users.json");

export class AuthService {
  static async register(data: User) {
    const users = await readJSON<User[]>(USERS_PATH);

    const exists = users.find(
      u => u.email === data.email || u.login === data.login || u.phone === data.phone
    );

    if (exists) throw new Error("User already exists");

    const newUser = { ...data, id: Date.now() };

    users.push(newUser);
    await writeJSON(USERS_PATH, users);

    return newUser;
  }

  static async login(data: { login: string; password: string }) {
    const users = await readJSON<User[]>(USERS_PATH);

    const user = users.find(
      u =>
        (u.login === data.login || u.email === data.login || u.phone === data.login) &&
        u.password === data.password
    );

    if (!user) throw new Error("Invalid credentials");

    return user;
  }
}
