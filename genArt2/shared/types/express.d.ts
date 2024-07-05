import { SignedInAuthObject } from '../types/auth';

declare module 'express-serve-static-core' {
    interface Request {
        auth?: SignedInAuthObject;
    }
}
