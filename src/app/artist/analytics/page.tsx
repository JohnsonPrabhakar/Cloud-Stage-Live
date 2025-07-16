
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Ticket, Users } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { useAuth } from '@/hooks/use-auth';

const chartConfig = {
  ticketsSold: {
    label: "Tickets Sold",
    color: "hsl(var(--accent))",
  },
  revenue: {
    label: "Revenue (Rs.)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ArtistAnalyticsPage() {
  const { user, events, allTickets } = useAuth();
  
  const artistEvents = events.filter(e => e.artistId === user?.id);
  const artistEventIds = new Set(artistEvents.map(e => e.id));
  
  // Ensure allTickets is not undefined before filtering
  const artistTickets = allTickets ? allTickets.filter(t => artistEventIds.has(t.eventId)) : [];

  const chartData = artistEvents.map(event => {
    const ticketsForEvent = artistTickets.filter(t => t.eventId === event.id);
    const ticketsSoldCount = ticketsForEvent.length;
    const revenueForEvent = ticketsSoldCount * event.price;

    return {
      name: event.title.slice(0, 15) + (event.title.length > 15 ? '...' : ''),
      ticketsSold: ticketsSoldCount,
      revenue: revenueForEvent,
    };
  });

  const totalRevenue = chartData.reduce((acc, item) => acc + item.revenue, 0);
  const totalTicketsSold = chartData.reduce((acc, item) => acc + item.ticketsSold, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Your Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Your fan base</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="font-headline">Per-Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <RechartsBarChart data={chartData} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        width={120}
                     />
                    <XAxis type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="ticketsSold" name="Tickets Sold" fill="var(--color-ticketsSold)" radius={5} />
                    <Bar dataKey="revenue" name="Revenue (Rs.)" fill="var(--color-revenue)" radius={5} />
                </RechartsBarChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>No event data available to display analytics.</p>
              <p className="text-sm">Create an event to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
