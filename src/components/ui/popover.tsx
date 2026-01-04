import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const togglePopover = () => setIsOpen(!isOpen);

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={togglePopover} className="inline-block">
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-[200px] rounded-md border bg-white p-4 shadow-lg dark:bg-gray-800 dark:border-gray-700',
            positionClasses[side],
            alignClasses[align],
            className
          )}
          style={{ margin: `${sideOffset}px 0` }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export { Popover };