import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export class StorageService {
  private static readonly BUCKETS = {
    AVATARS: 'avatars',
    DOCUMENTS: 'documents',
    HEALTH_RECORDS: 'health-records',
  } as const;

  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile(
    file: File,
    bucket: keyof typeof StorageService.BUCKETS,
    userId: string,
    folder?: string
  ): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${userId}/${folder}/${fileName}` : `${userId}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(StorageService.BUCKETS[bucket])
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(StorageService.BUCKETS[bucket])
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error: any) {
      return {
        url: '',
        path: '',
        error: error.message || 'Upload failed',
      };
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  static async deleteFile(
    bucket: keyof typeof StorageService.BUCKETS,
    filePath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(StorageService.BUCKETS[bucket])
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Delete failed',
      };
    }
  }

  /**
   * Get a signed URL for private files
   */
  static async getSignedUrl(
    bucket: keyof typeof StorageService.BUCKETS,
    filePath: string,
    expiresIn: number = 3600
  ): Promise<{ url: string; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(StorageService.BUCKETS[bucket])
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw error;
      }

      return { url: data.signedUrl };
    } catch (error: any) {
      return {
        url: '',
        error: error.message || 'Failed to get signed URL',
      };
    }
  }

  /**
   * Upload avatar image
   */
  static async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    return this.uploadFile(file, 'AVATARS', userId);
  }

  /**
   * Upload document to vault
   */
  static async uploadDocument(file: File, userId: string, category?: string): Promise<UploadResult> {
    return this.uploadFile(file, 'DOCUMENTS', userId, category);
  }

  /**
   * Upload health record file
   */
  static async uploadHealthRecord(file: File, userId: string): Promise<UploadResult> {
    return this.uploadFile(file, 'HEALTH_RECORDS', userId);
  }

  /**
   * Validate file type and size
   */
  static validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}): { valid: boolean; error?: string } {
    const { maxSize = 10 * 1024 * 1024, allowedTypes } = options; // Default 10MB

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
      };
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { valid: true };
  }

  /**
   * Get file info from URL
   */
  static getFileInfoFromUrl(url: string): { bucket: string; path: string } | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucket = pathParts[pathParts.length - 2];
      const path = pathParts[pathParts.length - 1];
      return { bucket, path };
    } catch {
      return null;
    }
  }
}

// File type constants
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  ...ALLOWED_IMAGE_TYPES
];

export const MAX_FILE_SIZES = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 25 * 1024 * 1024, // 25MB
  HEALTH_RECORD: 50 * 1024 * 1024, // 50MB
} as const;
