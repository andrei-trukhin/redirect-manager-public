import { HttpService } from './http.service';

export interface Redirect {
  id: number;
  source: string;
  destination: string;
  statusCode: number;
  createdAt?: string;
  updatedAt?: string;
  enabled?: boolean;
  domain?: string | null;
  isCaseSensitive?: boolean;
}

export interface PaginationMeta {
  total: number;
  page?: number;
  limit?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedRedirectsResponse {
  data: Redirect[];
  pagination: PaginationMeta;
}

export interface FilterProps {
  statusCode?: number;
  source?: string;
  destination?: string;
}

export interface GetRedirectsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: FilterProps;
}

export interface CreateRedirectRequest {
  source: string;
  sourcePrefix: string;
  sourceLength: number;
  destination: string;
  statusCode: number;
  domain?: string | null;
  enabled?: boolean;
  isCaseSensitive?: boolean;
}

export interface UpdateRedirectRequest {
  source: string;
  sourcePrefix: string;
  sourceLength: number;
  destination: string;
  statusCode: number;
  domain?: string | null;
  enabled?: boolean;
  isCaseSensitive?: boolean;
}

export class RedirectsService {
  static async getRedirects(params?: GetRedirectsParams): Promise<PaginatedRedirectsResponse> {
    const queryParams: Record<string, string | number> = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      sortBy: params?.sortBy || 'id',
      sortOrder: params?.sortOrder || 'asc',
    };

    if (params?.filters) {
      if (params.filters.statusCode !== undefined) {
        queryParams['statusCode'] = params.filters.statusCode;
        queryParams['statusCodeOp'] = 'eq';
      }

      if (params.filters.source !== undefined && params.filters.source.trim() !== '') {
        queryParams['source'] = params.filters.source;
        queryParams['sourceOp'] = 'contains';
      }

      if (params.filters.destination !== undefined && params.filters.destination.trim() !== '') {
        queryParams['destination'] = params.filters.destination;
        queryParams['destinationOp'] = 'contains';
      }
    }

    return HttpService.get<PaginatedRedirectsResponse>('/v1/redirects', queryParams);
  }

  static async getRedirectById(id: string | number): Promise<Redirect> {
    return HttpService.get<Redirect>(`/v1/redirects/${id}`);
  }

  static async createRedirect(data: CreateRedirectRequest): Promise<Redirect> {
    return HttpService.post<Redirect>('/v1/redirects', data);
  }

  static async updateRedirect(id: string | number, data: UpdateRedirectRequest): Promise<Redirect> {
    return HttpService.put<Redirect>(`/v1/redirects/${id}`, data);
  }

  static async patchRedirect(id: string | number, data: Partial<UpdateRedirectRequest>): Promise<Redirect> {
    return HttpService.patch<Redirect>(`/v1/redirects/${id}`, data);
  }

  static async deleteRedirect(id: string | number): Promise<void> {
    return HttpService.delete<void>(`/v1/redirects/${id}`);
  }

  static async deleteBatch(ids: (string | number)[]): Promise<void> {
    return HttpService.delete<void>('/v1/redirects/batch', { ids });
  }

  static async patchBatch(redirects: Array<{ id: string | number } & Partial<UpdateRedirectRequest>>): Promise<void> {
    return HttpService.patch<void>('/v1/redirects/batch', { redirects });
  }
}
