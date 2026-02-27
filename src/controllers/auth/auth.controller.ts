import type { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service.ts";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);

      res.cookie("session", user.id, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000 // 10 минут
      });

      res.json({ message: "User registered", user });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const user = await AuthService.login(req.body);

      res.cookie("session", user.id, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000
      });

      res.json({ message: "Logged in", user });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}
