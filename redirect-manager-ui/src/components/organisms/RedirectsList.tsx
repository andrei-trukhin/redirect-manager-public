import React, {useEffect, useState} from 'react';
import {EntitiesList, ErrorState, RedirectRow,} from '../molecules';
import {type FilterProps, type Redirect as ApiRedirect, RedirectsService} from '../../services/redirects.service';

export interface Redirect {
  id: string;
  source: string;
  destination: string;
  httpCode: number;
  enabled: boolean;
  domain?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RedirectsListProps {
  className?: string;
  itemsPerPage?: number;
  filterParams?: FilterProps;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  onRefresh?: () => Promise<void>;
  onDataChange?: (redirects: Redirect[]) => void;
  currentPage?: number;
  onPaginationDataChange?: (currentPage: number, totalPages: number) => void;
}

const RedirectsList: React.FC<RedirectsListProps> = ({
  className = '',
  itemsPerPage = 8,
  filterParams = {},
  selectedIds = new Set<string>(),
  onSelectionChange,
  onRefresh,
  onDataChange,
  currentPage = 1,
  onPaginationDataChange,
}) => {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRedirects = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const response = await RedirectsService.getRedirects({
        page,
        limit: itemsPerPage,
        sortBy: 'id',
        sortOrder: 'asc',
        filters: filterParams
      });

      const mappedRedirects: Redirect[] = response.data.map((redirect: ApiRedirect) => ({
        id: String(redirect.id),
        source: redirect.source,
        destination: redirect.destination,
        httpCode: redirect.statusCode,
        enabled: redirect.enabled ?? false,
        domain: redirect.domain,
        createdAt: redirect.createdAt,
        updatedAt: redirect.updatedAt,
      }));

      setRedirects(mappedRedirects);
      const newTotalPages = Math.ceil(response.pagination.total / itemsPerPage);

      if (onDataChange) {
        onDataChange(mappedRedirects);
      }

      if (onPaginationDataChange) {
        onPaginationDataChange(page, newTotalPages);
      }

      if (onRefresh) {
        await onRefresh();
      }

      return mappedRedirects;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch redirects');
      console.error('Error fetching redirects:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRedirects();
  }, [currentPage, filterParams]);

  const handleSelectItem = (id: string) => {
    if (onSelectionChange) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      onSelectionChange(newSet);
    }
  };

  return (
    <div className={className}>

      {error && (
        <ErrorState
          title="Error Loading Redirects"
          message={error}
          onRetry={() => globalThis.location.reload()}
        />
      )}

      {!error && (
          <EntitiesList
              isLoading={loading}
              isEmpty={redirects.length === 0}
              emptyIcon={<></>}
              emptyMessage=""
          >
            {redirects.map((redirect) => (
                <RedirectRow
                    key={redirect.id}
                    id={redirect.id}
                    source={redirect.source}
                    destination={redirect.destination}
                    httpCode={redirect.httpCode}
                    domain={redirect.domain ?? null}
                    createdAt={redirect.createdAt}
                    updatedAt={redirect.updatedAt}
                    selected={selectedIds.has(redirect.id)}
                    onSelected={onSelectionChange ? () => handleSelectItem(redirect.id) : undefined}
                />
            ))}
          </EntitiesList>
      )}
    </div>
  );
};

export default RedirectsList;
