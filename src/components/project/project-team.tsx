import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UserPlus, Mail, Settings, MoreHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  userId: string;
  name: string;
  role: string;
  avatar?: string;
}

export function ProjectTeam({ teamMembers, isLoading, error }: { 
  teamMembers: TeamMember[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Team Members</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <UserPlus className="h-4 w-4" />
          <span className="sr-only">Add team member</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.length > 0 ? (
          <>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.userId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Send message</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send message</TooltipContent>
                    </Tooltip>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Send Message</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Remove from Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No team members yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Invite team members to collaborate on this project and work together more efficiently.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <Mail className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Email Invites</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <Settings className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Role Management</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Members
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Browse Team
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
