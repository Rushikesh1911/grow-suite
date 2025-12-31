import { useState } from 'react';
import { Plus, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientsHeaderProps {
  onOpenCreateModal: () => void;
  onFilterChange: (filter: string) => void;
  onStatusChange: (status: string) => void;
  onToggleFavorites: () => void;
  showFavorites: boolean;
  currentStatus: string;
}

export function ClientsHeader({
  onOpenCreateModal,
  onFilterChange,
  onStatusChange,
  onToggleFavorites,
  showFavorites,
  currentStatus = 'all'
}: ClientsHeaderProps) {

  return (
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between py-1">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-semibold">Clients</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search clients..."
            className="pl-8"
            onChange={(e) => onFilterChange(e.target.value)}
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Button
          variant={showFavorites ? 'secondary' : 'outline'}
          size="icon"
          onClick={onToggleFavorites}
          className="shrink-0"
        >
          <Star className={`h-4 w-4 ${showFavorites ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={currentStatus} onValueChange={onStatusChange}>
              <DropdownMenuRadioItem value="all">All Clients</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="prospect">Prospects</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="on-hold">On Hold</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={onOpenCreateModal} className="shrink-0 ml-1">
          <Plus className="mr-1.5 h-4 w-4" />
          Create Client
        </Button>
      </div>
    </div>
  );
}
