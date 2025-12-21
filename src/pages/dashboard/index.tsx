import {
  CheckCircle,
  FileText,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Zap,
  ChevronRight,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';


// Mock data
const stats = [
  {
    title: 'Monthly Revenue',
    value: '$8,420',
    change: '+12.5%',
    trend: 'up',
    icon: <CircleDollarSign className="h-5 w-5" />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  {
    title: 'Active Projects',
    value: '7',
    change: '+2',
    trend: 'up',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    title: 'Hours Tracked',
    value: '142.5',
    change: '+18.2%',
    trend: 'up',
    icon: <Clock3 className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    title: 'Client Satisfaction',
    value: '98%',
    change: '+2.1%',
    trend: 'up',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
];

const projects = [
  {
    id: 1,
    name: 'E-commerce Website',
    client: 'Acme Corp',
    progress: 75,
    status: 'in-progress',
    dueDate: '2023-12-15',
    budget: '$5,200',
    hours: 62.5
  },
  {
    id: 2,
    name: 'Mobile App Redesign',
    client: 'Starlight',
    progress: 30,
    status: 'in-progress',
    dueDate: '2024-01-10',
    budget: '$3,800',
    hours: 28.0
  },
  {
    id: 3,
    name: 'Brand Identity',
    client: 'Nova',
    progress: 90,
    status: 'review',
    dueDate: '2023-12-05',
    budget: '$2,400',
    hours: 42.0
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'payment',
    title: 'Payment Received',
    description: 'From Acme Corp for E-commerce Website',
    amount: '$2,500',
    time: '2 hours ago',
    icon: <CircleDollarSign className="h-4 w-4 text-emerald-500" />
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    description: 'From Sarah Johnson - Project Update',
    time: '5 hours ago',
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />
  },
  {
    id: 3,
    type: 'task',
    title: 'Task Completed',
    description: 'Homepage Redesign - Mobile App',
    time: '1 day ago',
    icon: <CheckCircle className="h-4 w-4 text-green-500" />
  },
];

const timeEntries = [
  { day: 'Mon', hours: 6.5 },
  { day: 'Tue', hours: 8 },
  { day: 'Wed', hours: 7 },
  { day: 'Thu', hours: 6 },
  { day: 'Fri', hours: 5 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 2 },
];

export default function DashboardPage() {

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your weekly summary</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            This Week
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Projects Overview */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Your current workload and progress</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant={project.status === 'completed' ? 'default' : 'outline'}>
                      {project.status === 'in-progress' ? 'In Progress' : 
                       project.status === 'review' ? 'In Review' : 'Completed'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{project.client}</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {project.dueDate}</span>
                      <span>{project.hours}h • {project.budget}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Time Tracking */}
        <div className="col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-1 rounded-full p-1.5 ${activity.icon.props.className.includes('text-') ? '' : 'bg-primary/10'}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.title}</p>
                      {activity.amount && (
                        <span className="text-sm font-medium text-emerald-500">{activity.amount}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time This Week</CardTitle>
              <CardDescription>Tracked hours and productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[120px] flex items-end justify-between">
                {timeEntries.map((entry, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-primary/10 rounded-t-sm" 
                      style={{ height: `${(entry.hours / 8) * 80}px` }}
                    >
                      <div className="h-full bg-primary/80 hover:bg-primary rounded-t-sm transition-all" />
                    </div>
                    <span className="mt-2 text-xs text-muted-foreground">{entry.day}</span>
                    <span className="text-xs font-medium">{entry.hours || ''}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Total</p>
                    <p className="text-xl font-bold">34.5 <span className="text-sm font-normal text-muted-foreground">hours</span></p>
                  </div>
                  <Button variant="outline" size="sm">
                    Track Time
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


