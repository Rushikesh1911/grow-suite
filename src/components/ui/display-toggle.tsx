import { List, LayoutGrid } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

type DisplayType = 'list' | 'board';

interface DisplayToggleProps {
  displayType: DisplayType;
  onDisplayTypeChange: (type: DisplayType) => void;
  className?: string;
}

export function DisplayToggle({ 
  displayType, 
  onDisplayTypeChange, 
  className 
}: DisplayToggleProps) {
  return (
    <div className={cn("inline-flex items-center rounded-md border p-1 bg-muted/40", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-2.5 text-muted-foreground',
          displayType === 'list' && 'bg-background shadow-sm text-foreground'
        )}
        onClick={() => onDisplayTypeChange('list')}
      >
        <List className="h-4 w-4 mr-1.5" />
        <span className="text-xs">List</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-2.5 text-muted-foreground',
          displayType === 'board' && 'bg-background shadow-sm text-foreground'
        )}
        onClick={() => onDisplayTypeChange('board')}
      >
        <LayoutGrid className="h-4 w-4 mr-1.5" />
        <span className="text-xs">Board</span>
      </Button>
    </div>
  );
}
