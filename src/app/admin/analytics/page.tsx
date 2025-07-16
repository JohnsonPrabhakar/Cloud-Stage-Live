
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Ticket, User, Users } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useAuth } from '@/hooks/use-auth';

const chartData = [
  { month: "January", events: 186, revenue: 8000 },
  { month: "February", events: 305, revenue: 12000 },
  { month: "March", events: 237, revenue: 9500 },
  { month: "April", events: 73, revenue: 4500 },
  { month: "May", events: 209, revenue: 11000 },
  { month: "June", events: 214, revenue: 13000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  events: {
    label: "Events",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export default function AdminAnalyticsPage() {
  const { registeredUsers } = useAuth();
  
  const totalPlatformUsers = registeredUsers.filter(u => u.role === 'user').length;
  const totalArtists = registeredUsers.filter(u => u.role === 'artist' && u.applicationStatus === 'approved').length;

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Platform Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlatformUsers}</div>
            <p className="text-xs text-muted-foreground">Total non-artist users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Artists</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArtists}</div>
            <p className="text-xs text-muted-foreground">Total approved artists</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Revenue and Events Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <RechartsBarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="events" fill="var(--color-events)" radius={4} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
