import { Router } from "express";
import { AuthController } from "../controllers/auth/auth.controller";
import { ProductsController } from "../controllers/products/products.controller";
import { BasketController } from "../controllers/bascket/bascket.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();


router.get("/basket", authMiddleware, BasketController.getBasket);
router.post("/basket/add", authMiddleware, BasketController.add);
router.patch("/basket/update", authMiddleware, BasketController.update);
router.delete("/basket/remove/:productId", authMiddleware, BasketController.remove);

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/products", ProductsController.getProducts);

export default router;
