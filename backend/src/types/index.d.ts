declare module 'string-similarity' {
  export function compareTwoStrings(str1: string, str2: string): number;
  export function findBestMatch(mainString: string, targetStrings: string[]): {
    ratings: { target: string; rating: number }[];
    bestMatch: { target: string; rating: number };
    bestMatchIndex: number;
  };

  export interface AuthRequest extends Request {
    user: {
      id: string;
      email?: string;
      role?: string;
    };
  }
}

declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  interface CloudinaryStorageOptions {
    cloudinary: any;
    params?: any;
  }
  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(req: any, file: any, cb: (error: any, info?: Partial<{ path: string; filename: string }>) => void): void;
    _removeFile(req: any, file: any, cb: (error: any) => void): void;
  }
  export { CloudinaryStorage };
}
