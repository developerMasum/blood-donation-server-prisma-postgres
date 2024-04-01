import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { userValidation } from "./user.validation";
import { ZodError } from "../../Interfaces/errorSource";

const router = express.Router();



router.post(
  "/user/register",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      userValidation.createUser.parse(req.body);

      return userController.createUser(req, res, next);
    } catch (error: unknown) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as ZodError;
        const errorDetails = {
          issues: zodError.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        };
        const errorMessage = zodError.issues
          .map((issue) => issue.message)
          .join(". ");

        return res.status(400).json({
          success: false,
          message: errorMessage,
          errorDetails: errorDetails,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: (error as Error).message || "Unknown error occurred",
        });
      }
    }
  }
);

router.get("/donor-list", userController.getAllDonor);
router.post(
  "/donation-request",
  auth(UserRole.USER),
  userController.createDonationRequest
);
router.get(
  "/donation-request",
  auth(UserRole.USER),
  userController.getAllDonationRequest
);
router.post(
  "/donation-request/:requestId",
  auth(UserRole.USER),
  userController.updateRequestStatus
);
router.get("/my-profile", auth(UserRole.USER), userController.getMyProfile);
router.put("/my-profile", auth(UserRole.USER), userController.updateMyProfile);
export const UserRoutes = router;
