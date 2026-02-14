import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ActionBar, RedirectsList} from '../organisms';
import RedirectsFilter from '../molecules/RedirectsFilter';
import Pagination from '../molecules/Pagination';
import {MainLayout} from '../templates';
import {Button, CreateNewButton} from '../atoms';
import {type FilterProps, RedirectsService} from '../../services/redirects.service';
import {ListWrapper} from "../molecules";
import {ArrowRightLeft} from "lucide-react";

const Redirects: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterParams, setFilterParams] = useState<FilterProps>({});
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [redirectIds, setRedirectIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilter = (params: FilterProps) => {
    setFilterParams(params);
  };

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds);
  };

  const handleDataChange = (redirects: any[]) => {
    setRedirectIds(redirects.map(r => r.id));

    let initialLength = redirects.length;
    redirects.forEach(redirect => {
        if (selectedIds.has(redirect.id)) {
            initialLength--;
        }
    })
    setTotalCount(initialLength + selectedIds.size);
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set([...redirectIds, ...selectedIds]));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
    setTotalCount(redirectIds.length);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    globalThis.scroll({top: 0, behavior: 'smooth'});
  };

  const handlePaginationDataChange = (page: number, total: number) => {
    setCurrentPage(page);
    setTotalPages(total);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDelete = async () => {
    try {
      // Delete all selected redirects using batch delete
      await RedirectsService.deleteBatch(Array.from(selectedIds));
      // Clear selection
      setSelectedIds(new Set());
      // Trigger refresh
      triggerRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete redirects');
    }
  };

  const handleEnable = async () => {
    try {
      // Enable all selected redirects using batch patch
      const redirectsToUpdate = Array.from(selectedIds).map(id => ({ id, enabled: true }));
      await RedirectsService.patchBatch(redirectsToUpdate);
      // Clear selection
      setSelectedIds(new Set());
      // Trigger refresh
      triggerRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable redirects');
    }
  };

  const handleDisable = async () => {
    try {
      // Disable all selected redirects using batch patch
      const redirectsToUpdate = Array.from(selectedIds).map(id => ({ id, enabled: false }));
      await RedirectsService.patchBatch(redirectsToUpdate);
      // Clear selection
      setSelectedIds(new Set());
      // Trigger refresh
      triggerRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable redirects');
    }
  };

  return (
      <MainLayout>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Redirects</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your URL redirects and their HTTP status codes
            </p>
          </div>
          <CreateNewButton
            onClick={() => navigate('/redirects/create')}
            className="self-start sm:self-center"
          />
        </div>

        <div className="mb-4">
          <RedirectsFilter onFilter={handleFilter}/>
        </div>

        <ActionBar
            selectedCount={selectedIds.size}
            totalCount={totalCount}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onEnable={handleEnable}
            onDisable={handleDisable}
            onDelete={handleDelete}
            onError={setError}
            active={selectedIds.size > 0}
            className="mb-4"
        />

        {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
              <Button
                  variant={"outline"}
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </Button>
            </div>
        )}

        <ListWrapper
            icon={ArrowRightLeft} title="Redirects List"
        >
          <RedirectsList
              key={refreshTrigger}
              filterParams={filterParams}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              onDataChange={handleDataChange}
              onRefresh={() => Promise.resolve()}
              currentPage={currentPage}
              onPaginationDataChange={handlePaginationDataChange}
          />
        </ListWrapper>



        {totalCount > 0 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
            />
        )}
      </MainLayout>
  );
};

export default Redirects;
