
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
import { useMemo } from 'react';

const chartConfig = {
  revenue: {
    label: "Revenue (Rs.)",
    color: "hsl(var(--primary))",
  },
  events: {
    label: "Events with Sales",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export default function AdminAnalyticsPage() {
  const { registeredUsers, allTickets, events } = useAuth();
  
  const totalPlatformUsers = registeredUsers.filter(u => u.role === 'user').length;
  const totalArtists = registeredUsers.filter(u => u.role === 'artist' && u.applicationStatus === 'approved').length;
  const totalTicketsSold = allTickets?.length || 0;
  
  const totalRevenue = useMemo(() => {
    if (!allTickets || !events) return 0;
    return allTickets.reduce((acc, ticket) => {
      const event = events.find(e => e.id === ticket.eventId);
      return acc + (event?.price || 0);
    }, 0);
  }, [allTickets, events]);

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { month: string, revenue: number, events: Set<string> } } = {};

    if (!allTickets || !events) return [];
    
    allTickets.forEach(ticket => {
      const event = events.find(e => e.id === ticket.eventId);
      if (!event) return;

      const month = new Date(ticket.purchaseDate).toLocaleString('default', { month: 'long', year: 'numeric' });
      const monthShort = new Date(ticket.purchaseDate).toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { month: monthShort, revenue: 0, events: new Set() };
      }
      
      monthlyData[month].revenue += event.price;
      monthlyData[month].events.add(event.id);
    });
    
    // Sort data chronologically - this is a simplified sort, a more robust one might be needed for multi-year data
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedMonths.map(month => {
      const data = monthlyData[month];
      return {
        month: data.month,
        revenue: data.revenue,
        events: data.events.size,
      }
    });

  }, [allTickets, events]);


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
            <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All-time platform revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All-time tickets sold</p>
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
           {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <RechartsBarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs.${value}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="events" fill="var(--color-events)" radius={4} name="Events with Sales"/>
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} name="Revenue (Rs.)" />
                </RechartsBarChart>
            </ChartContainer>
          ) : (
             <div className="text-center py-16 text-muted-foreground">
              <p>No sales data available to display analytics.</p>
              <p className="text-sm">Ticket sales will appear here once they happen.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
