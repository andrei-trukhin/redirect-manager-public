import React, {useState} from 'react';
import {X} from 'lucide-react';
import ActionButtonGroup from '../molecules/ActionButtonGroup';
import ConfirmDialog from '../molecules/ConfirmDialog';
import IconButton from '../atoms/IconButton';
import {Button} from "../atoms";

export interface ActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDelete?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onError?: (error: string) => void;
  active?: boolean;
  className?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDelete,
  onEnable,
  onDisable,
  onError,
  active = true,
  className = '',
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const handleDeleteClick = () => {
    if (selectedCount === 0 || !onDelete) return;
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Error deleting items:', err);
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to delete items. Please try again.');
      }
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEnable = async () => {
    if (!onEnable) return;
    
    try {
      await onEnable();
    } catch (err) {
      console.error('Error enabling items:', err);
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to enable items. Please try again.');
      }
    }
  };

  const handleDisable = async () => {
    if (!onDisable) return;
    
    try {
      await onDisable();
    } catch (err) {
      console.error('Error disabling items:', err);
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to disable items. Please try again.');
      }
    }
  };

  if (showDeleteConfirm) {
    return (
      <ConfirmDialog
        title="Delete Redirects"
        message={`Are you sure you want to delete ${selectedCount} redirect${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        variant="warning"
        isLoading={isDeleting}
        loadingLabel="Deleting..."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        className={className}
      />
    );
  }

  const containerClasses = active
    ? 'bg-blue-50 border border-blue-200'
    : 'bg-white border border-gray-300';
  
  const textClasses = active
    ? 'text-blue-900'
    : 'text-gray-500';
  
  const buttonClasses = active
    ? 'text-blue-600 hover:text-blue-800'
    : 'text-gray-400 hover:text-gray-600';

  return (
    <div
      className={`${containerClasses} rounded-lg px-4 py-3 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className={`text-sm font-medium ${textClasses}`}>
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </div>
        <div className="flex gap-2">
          {allSelected ? (
              <Button
                  size={"md"}
                  variant="ghost-primary"
                  onClick={onDeselectAll}
                  className={`text-sm ${buttonClasses} font-medium transition-colors`}
                  disabled={!active}
              >
                Deselect all
              </Button>
          ) : (
              <Button
                  variant="ghost"
                  size={"md"}
                  onClick={onSelectAll}
                  className={`text-sm ${buttonClasses} font-medium transition-colors`}
              >
                Select all {totalCount}
              </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {active && (
          <>
            <ActionButtonGroup
              onEnable={handleEnable}
              onDisable={handleDisable}
              onDelete={handleDeleteClick}
            />
            <IconButton
                variant="ghost"
              size={"md"}
              onClick={onDeselectAll}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Clear selection"
              icon={<X className="w-5 h-5" />}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
