export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: string;
      tenantId?: string | null;
    };
  }

  interface UserPublicMetadata {
    role?: string;
    tenantId?: string | null;
  }
}
