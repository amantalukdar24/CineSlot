import { Multer } from "multer";
import { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
      user?:JwtPayload,
    }
  }
}
