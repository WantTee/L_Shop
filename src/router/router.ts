import { Router } from "express";
import { AuthController } from "../controllers/auth/auth.controller";
import { ProductsController } from "../controllers/products/products.controller";
import { BasketController } from "../controllers/basket/basket.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();


router.get("/basket", authMiddleware, BasketController.getBasket);
router.post("/basket/add", authMiddleware, BasketController.add);
router.patch("/basket/update", authMiddleware, BasketController.update);
router.delete("/basket/remove/:productId", authMiddleware, BasketController.remove);
router.delete("/basket/clear", authMiddleware, BasketController.clear);

router.get("/products", ProductsController.getProducts);


router.post("/auth/sendCode", AuthController.sendCode);
router.post("/auth/verify-code", AuthController.verifyCode);

export = router;
