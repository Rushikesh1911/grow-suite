import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UserPlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TeamMember {
  userId: string;
  name: string;
  role: string;
  avatar?: string;
}

export function ProjectTeam({ teamMembers }: { teamMembers: TeamMember[] }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
                <Button variant="outline" size="sm">Message</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <UserPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium">No team members</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add team members to collaborate on this project
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </div>
        )}
        
        {teamMembers.length > 0 && (
          <Button variant="outline" className="w-full mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
