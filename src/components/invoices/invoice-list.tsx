import { format, parseISO, isWithinInterval, subDays } from "date-fns";
import { ArrowUpDown, Download, FileText, MoreHorizontal, Filter, Save, X, SlidersHorizontal  , Search} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

const PRESET_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'This month', value: 'month' },
  { label: 'This year', value: 'year' },
];

type Invoice = {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issueDate: string;
  dueDate: string;
};

interface FilterState {
  status: string[];
  amountMin: string;
  amountMax: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  searchQuery: string;
  preset: string | null;
}

type InvoiceListProps = {
  invoices: Invoice[];
  onSelect?: (id: string) => void;
  onFiltersChange?: (filters: Omit<FilterState, 'preset'>) => void;
  savedPresets?: { name: string; filters: Omit<FilterState, 'preset'> }[];
  onSavePreset?: (name: string, filters: Omit<FilterState, 'preset'>) => void;
};

export function InvoiceList({ 
  invoices, 
  onSelect, 
  onFiltersChange,
  savedPresets = [],
  onSavePreset
}: InvoiceListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    amountMin: '',
    amountMax: '',
    dateRange: { from: undefined, to: undefined },
    searchQuery: '',
    preset: null,
  });

  const statusColors = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    pending: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-800/80 dark:text-yellow-100',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const statusOptions = ['paid', 'pending', 'overdue', 'draft'];

  useEffect(() => {
    onFiltersChange?.({
      status: filters.status,
      amountMin: filters.amountMin,
      amountMax: filters.amountMax,
      dateRange: filters.dateRange,
      searchQuery: filters.searchQuery
    });
  }, [filters, onFiltersChange]);

  const applyPreset = (preset: { name: string; filters: Omit<FilterState, 'preset'> }) => {
    setFilters(prev => ({
      ...prev,
      ...preset.filters,
      preset: preset.name
    }));
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const { preset: _, ...filtersToSave } = filters;
    onSavePreset?.(presetName, filtersToSave);
    setPresetName('');
    setShowSavePreset(false);
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      amountMin: '',
      amountMax: '',
      dateRange: { from: undefined, to: undefined },
      searchQuery: '',
      preset: null,
    });
  };

  const applyDateRangePreset = (preset: string) => {
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (preset) {
      case 'today':
        from = today;
        to = today;
        break;
      case '7days':
        from = subDays(today, 7);
        to = today;
        break;
      case '30days':
        from = subDays(today, 30);
        to = today;
        break;
      case 'month':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'year':
        from = new Date(today.getFullYear(), 0, 1);
        to = new Date(today.getFullYear(), 11, 31);
        break;
    }

    setFilters(prev => ({
      ...prev,
      dateRange: { from, to },
      preset: null
    }));
  };

  const filteredInvoices = invoices.filter(invoice => {
    // Filter by status
    if (filters.status.length > 0 && !filters.status.includes(invoice.status)) {
      return false;
    }

    // Filter by amount
    if (filters.amountMin && invoice.amount < parseFloat(filters.amountMin)) {
      return false;
    }
    if (filters.amountMax && invoice.amount > parseFloat(filters.amountMax)) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      const invoiceDate = parseISO(invoice.issueDate);
      const from = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const to = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      
      if (from && invoiceDate < from) return false;
      if (to) {
        const nextDay = new Date(to);
        nextDay.setDate(to.getDate() + 1);
        if (invoiceDate >= nextDay) return false;
      }
    }

    // Filter by search query
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.client.toLowerCase().includes(searchLower) ||
        invoice.amount.toString().includes(searchLower) ||
        invoice.status.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.amountMin || 
    filters.amountMax || 
    filters.dateRange.from || 
    filters.dateRange.to ||
    filters.searchQuery;

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search invoices..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <Popover
            trigger={
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {hasActiveFilters ? 'Filters' : 'Filter'}
                </span>
                {hasActiveFilters && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {[
                      filters.status.length,
                      filters.amountMin || filters.amountMax ? 1 : 0,
                      filters.dateRange.from || filters.dateRange.to ? 1 : 0,
                    ].filter(Boolean).length}
                  </span>
                )}
              </Button>
            }
            isOpen={showFilters}
            onOpenChange={setShowFilters}
            className="w-80 p-4"
            align="end"
          >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-8 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Status</p>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              status: checked
                                ? [...prev.status, status]
                                : prev.filter(s => s !== status),
                              preset: null
                            }));
                          }}
                        />
                        <label
                          htmlFor={`status-${status}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Amount Range</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="amount-min" className="text-xs text-muted-foreground block mb-1">
                        Min
                      </label>
                      <Input
                        id="amount-min"
                        type="number"
                        placeholder="$"
                        value={filters.amountMin}
                        onChange={(e) => 
                          setFilters(prev => ({
                            ...prev, 
                            amountMin: e.target.value,
                            preset: null
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="amount-max" className="text-xs text-muted-foreground block mb-1">
                        Max
                      </label>
                      <Input
                        id="amount-max"
                        type="number"
                        placeholder="$"
                        value={filters.amountMax}
                        onChange={(e) => 
                          setFilters(prev => ({
                            ...prev, 
                            amountMax: e.target.value,
                            preset: null
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Date Range</p>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label htmlFor="date-from" className="text-xs text-muted-foreground block mb-1">
                          From
                        </label>
                        <Popover
                          trigger={
                            <Button
                              id="date-from"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !filters.dateRange.from && "text-muted-foreground"
                              )}
                            >
                              {filters.dateRange.from ? (
                                format(filters.dateRange.from, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          }
                          className="w-auto p-0"
                          align="start"
                        >
                          <div className="p-3">
                            <Calendar
                              initialFocus
                              mode="single"
                              selected={filters.dateRange.from}
                              onSelect={(date) => {
                                setFilters(prev => ({
                                  ...prev,
                                  dateRange: {
                                    ...prev.dateRange,
                                    from: date || undefined,
                                  },
                                  preset: null
                                }));
                              }}
                            />
                          </div>
                        </Popover>
                      </div>
                      <div>
                        <label htmlFor="date-to" className="text-xs text-muted-foreground block mb-1">
                          To
                        </label>
                        <Popover
                          trigger={
                            <Button
                              id="date-to"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !filters.dateRange.to && "text-muted-foreground"
                              )}
                            >
                              {filters.dateRange.to ? (
                                format(filters.dateRange.to, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          }
                          className="w-auto p-0"
                          align="start"
                        >
                          <div className="p-3">
                            <Calendar
                              initialFocus
                              mode="single"
                              selected={filters.dateRange.to}
                              onSelect={(date) => {
                                setFilters(prev => ({
                                  ...prev,
                                  dateRange: {
                                    ...prev.dateRange,
                                    to: date || undefined,
                                  },
                                  preset: null
                                }));
                              }}
                            />
                          </div>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_RANGES.map(({ label, value }) => (
                        <Button
                          key={value}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => applyDateRangePreset(value)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSavePreset(!showSavePreset)}
                    >
                      <Save className="mr-2 h-3.5 w-3.5" />
                      Save as preset
                    </Button>
                    
                    {showSavePreset && (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Preset name"
                          value={presetName}
                          onChange={(e) => setPresetName(e.target.value)}
                          className="h-8"
                        />
                        <Button 
                          size="sm" 
                          onClick={handleSavePreset}
                          disabled={!presetName.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
          </Popover>

          {savedPresets && savedPresets.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Presets
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Saved Presets</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {savedPresets.map((preset) => (
                  <DropdownMenuItem 
                    key={preset.name}
                    onSelect={() => applyPreset(preset)}
                  >
                    {preset.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.status.length > 0 && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center gap-1">
                {filters.status.map(status => (
                  <Badge key={status} variant="secondary">
                    {status}
                  </Badge>
                ))}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, status: [] }))}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {(filters.amountMin || filters.amountMax) && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span>
                {filters.amountMin && `$${filters.amountMin}`}
                {filters.amountMin && filters.amountMax && ' - '}
                {filters.amountMax && `$${filters.amountMax}`}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, amountMin: '', amountMax: '' }))}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {(filters.dateRange.from || filters.dateRange.to) && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span>
                {filters.dateRange.from ? format(filters.dateRange.from, 'MMM d') : ''}
                {filters.dateRange.from && filters.dateRange.to ? ' - ' : ''}
                {filters.dateRange.to ? format(filters.dateRange.to, 'MMM d, yyyy') : ''}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, dateRange: { from: undefined, to: undefined } }))}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-xs text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <div className="w-full">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1 flex items-center">
            <Checkbox />
          </div>
          <div className="col-span-3 flex items-center">
            <span>Invoice</span>
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y">
          {filteredInvoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="grid grid-cols-12 gap-4 px-6 py-4 text-sm hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelect?.(invoice.id)}
            >
              <div className="col-span-1 flex items-center">
                <Checkbox />
              </div>
              <div className="col-span-3 font-medium">
                <div>#{invoice.invoiceNumber}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(invoice.issueDate)}
                </div>
              </div>
              <div className="col-span-3">
                <div className="font-medium">{invoice.client}</div>
                <div className="text-xs text-muted-foreground">
                  Due {formatDate(invoice.dueDate)}
                </div>
              </div>
              <div className="col-span-2 text-right font-medium">
                {formatCurrency(invoice.amount)}
              </div>
              <div className="col-span-2">
                <Badge className={cn(
                  'px-2.5 py-1 text-xs',
                  statusColors[invoice.status]
                )}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>
              <div className="col-span-1 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle view
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

