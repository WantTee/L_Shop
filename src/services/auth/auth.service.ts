import { readJSON, writeJSON } from "../../utils/file";
import type { User } from "../../types/user";
import path from "path";
import nodemailer from "nodemailer";
import crypto from "crypto";

const USERS_PATH = path.join(process.cwd(), "database", "users.json");

console.log("USERS_PATH:", USERS_PATH);


const codes: Record<string, string> = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

  static async findOrCreateByEmail(email: string): Promise<User> {
    const users = await readJSON<User[]>(USERS_PATH);

    let user = users.find((u): u is User => u.email === email);

    if (!user) {
      const newUser: User = {
        id: Date.now(),
        name: email.split("@")[0] || "",
        login: email,
        email,
        phone: "",
        password: "",
      };

      users.push(newUser);
      await writeJSON(USERS_PATH, users);
      return newUser;
    }

    return user;
  }

  static async sendCode(email: string) {
    if (!email) throw new Error("Email required");

    const code = crypto.randomInt(100000, 999999).toString();
    codes[email] = code;

    setTimeout(() => delete codes[email], 5 * 60 * 1000);

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Ваш код для входа",
        text: `Ваш код: ${code}`,
      });

      console.log("Письмо отправлено:", email);
    } catch (err) {
      console.error("Ошибка отправки письма:", err);
      throw new Error("Не удалось отправить письмо");
    }
  }

  static async verifyCode(email: string, code: string) {
    if (codes[email] === code) {
      delete codes[email];
      await this.findOrCreateByEmail(email);
      return true;
    }
    return false;
  }
}
