import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, LayoutGrid, List, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ModernKanbanBoard } from '@/components/kanban/modern-kanban-board';

export default function ProjectsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your projects in a visual way
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
            />
          </div>
          
          <Tabs defaultValue="board" className="w-auto">
            <TabsList>
              <TabsTrigger value="board" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span>Board</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-hidden mt-6">
        <ModernKanbanBoard />
      </div>
    </div>
  );
}
