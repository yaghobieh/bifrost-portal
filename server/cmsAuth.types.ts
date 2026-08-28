export type CmsUserRow = {
  id: string;
  email: string;
  name: string;
  username: string | null;
  password_hash: string | null;
  role: string;
  provider: string | null;
  provider_id: string | null;
  created_at: string | Date;
  plan: string;
};

export type CmsPublicUser = {
  id: string;
  email: string;
  name: string;
  username: string | null;
  role: string;
  plan: string;
  premium: boolean;
};

export type CmsJwtPayload = {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type CmsAuthResult = {
  status: number;
  body: unknown;
};

export type CmsJsonBody = Record<string, string | undefined>;
