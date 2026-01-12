'use client';

import type { SkillTag, SkillTagPage } from '@/lib/api/tag';
import { skillTagApi } from '@/lib/api/tag';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@saint-giong/bamboo-ui';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  AdminToolbar,
  type ColumnDef,
  DataTable,
  type PaginationState,
} from '../_components';

export default function SkillTagsAdminPage() {
  const [tagsPage, setTagsPage] = useState<SkillTagPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<SkillTag | null>(null);
  const [tagName, setTagName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await skillTagApi.getAll({ page, size: pageSize });
      setTagsPage(data);
    } catch (error) {
      console.error('Failed to fetch skill tags:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Filter tags by search query (client-side for current page)
  const filteredTags =
    tagsPage?.content.filter((tag) => {
      if (!searchQuery) return true;
      return tag.name.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

  const handleCreate = async () => {
    if (!tagName.trim()) return;
    setIsSaving(true);
    try {
      await skillTagApi.create({ name: tagName.trim() });
      setIsCreateOpen(false);
      setTagName('');
      fetchTags();
    } catch (error) {
      console.error('Failed to create tag:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedTag || !tagName.trim()) return;
    setIsSaving(true);
    try {
      await skillTagApi.update(selectedTag.id, { name: tagName.trim() });
      setIsEditOpen(false);
      setSelectedTag(null);
      setTagName('');
      fetchTags();
    } catch (error) {
      console.error('Failed to update tag:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTag) return;
    setIsSaving(true);
    try {
      await skillTagApi.delete(selectedTag.id);
      setIsDeleteOpen(false);
      setSelectedTag(null);
      fetchTags();
    } catch (error) {
      console.error('Failed to delete tag:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (tag: SkillTag) => {
    setSelectedTag(tag);
    setTagName(tag.name);
    setIsEditOpen(true);
  };

  const openDelete = (tag: SkillTag) => {
    setSelectedTag(tag);
    setIsDeleteOpen(true);
  };

  const columns: ColumnDef<SkillTag>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '100px',
      sortable: true,
      render: (value) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {String(value)}
        </code>
      ),
    },
    {
      key: 'name',
      header: 'Tag Name',
      sortable: true,
      render: (value) => <span className="font-medium">{String(value)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              openDelete(row);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const pagination: PaginationState | undefined = tagsPage
    ? {
        page: tagsPage.number,
        size: tagsPage.size,
        totalElements: tagsPage.totalElements,
        totalPages: tagsPage.totalPages,
      }
    : undefined;

  return (
    <div className="flex h-full flex-col">
      <AdminToolbar
        title="Skill Tags"
        description="Manage skill tag taxonomy"
        searchPlaceholder="Filter by name..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={fetchTags}
        isLoading={isLoading}
        totalCount={tagsPage?.totalElements}
        actions={
          <Button
            size="sm"
            className="h-8"
            onClick={() => {
              setTagName('');
              setIsCreateOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Tag
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-4">
        <DataTable
          columns={columns}
          data={filteredTags}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(0);
          }}
          rowKey="id"
          emptyMessage="No skill tags found"
        />
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Skill Tag</DialogTitle>
            <DialogDescription>
              Add a new skill tag to the taxonomy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name</Label>
              <Input
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g., React, Python, Machine Learning"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!tagName.trim() || isSaving}
            >
              {isSaving ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill Tag</DialogTitle>
            <DialogDescription>Update the skill tag name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tag Name</Label>
              <Input
                id="edit-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!tagName.trim() || isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedTag?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
