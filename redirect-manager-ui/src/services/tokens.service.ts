import { HttpService } from './http.service';

export const TokenScope = {
  READ: 'READ',
  READ_WRITE: 'READ_WRITE',
} as const;

export type TokenScope = typeof TokenScope[keyof typeof TokenScope];

export interface ApiToken {
  id: string;
  name: string;
  scope: TokenScope;
  expiresAt: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface CreateTokenRequest {
  name: string;
  scope: TokenScope;
  expiresAt: string;
}

export interface CreateTokenResponse extends ApiToken {
  token: string; // The clear-text token shown only once
}

export const TokensService = {
  getTokens: async (): Promise<ApiToken[]> => {
    return HttpService.get<ApiToken[]>('/v1/api-tokens');
  },

  createToken: async (data: CreateTokenRequest): Promise<CreateTokenResponse> => {
    return HttpService.post<CreateTokenResponse>('/v1/api-tokens', data);
  },

  deleteToken: async (id: string): Promise<void> => {
    return HttpService.delete<void>(`/v1/api-tokens/${id}`);
  },
};


