/** Google Search Console OAuth + sync types (server-side). */

export const GSC_OAUTH_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export type GscCredential = {
  id: string;
  userId: string;
  refreshToken: string;
  connectedEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type GscConnectionStatus = {
  connected: boolean;
  connectedEmail: string | null;
  siteUrl: string;
};

export type GscSearchRow = {
  query: string;
  page: string;
  country: string;
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscTokenResponse = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

export type GscSyncResult = {
  syncedRows: number;
  insightsPrepared: number;
  periodStart: string;
  periodEnd: string;
  siteUrl: string;
};
