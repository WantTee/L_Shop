import { Router } from "express";
import { AuthController } from "../controllers/auth/auth.controller.ts";
import { ProductsController } from "../controllers/products/products.controller.ts";
import { BasketController } from "../controllers/bascket/bascket.controller.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();


router.get("/basket", authMiddleware, BasketController.getBasket);
router.post("/basket/add", authMiddleware, BasketController.add);
router.patch("/basket/update", authMiddleware, BasketController.update);
router.delete("/basket/remove/:productId", authMiddleware, BasketController.remove);

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/products", ProductsController.getProducts);

export default router;
