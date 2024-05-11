export type UploadCloudinaryUrlResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  folder: string;
  publicId: string | null;
};
