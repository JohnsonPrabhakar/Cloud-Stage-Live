
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Ticket, User, Users, CalendarIcon } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useAuth } from '@/hooks/use-auth';
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DateRange } from 'react-day-picker';
import { addDays, format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const filteredTickets = useMemo(() => {
    if (!allTickets) return [];
    if (!date || !date.from) return allTickets;
    
    const from = date.from;
    // Set 'to' to the end of the selected day
    const to = date.to ? new Date(date.to.setHours(23, 59, 59, 999)) : from;

    return allTickets.filter(ticket => {
        const purchaseDate = new Date(ticket.purchaseDate);
        return purchaseDate >= from && purchaseDate <= to;
    })
  }, [allTickets, date]);
  
  const totalPlatformUsers = registeredUsers.filter(u => u.role === 'user').length;
  const totalArtists = registeredUsers.filter(u => u.role === 'artist' && u.applicationStatus === 'approved').length;
  const totalTicketsSold = filteredTickets?.length || 0;
  
  const totalRevenue = useMemo(() => {
    if (!filteredTickets || !events) return 0;
    return filteredTickets.reduce((acc, ticket) => {
      const event = events.find(e => e.id === ticket.eventId);
      return acc + (event?.price || 0);
    }, 0);
  }, [filteredTickets, events]);

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { month: string, revenue: number, events: Set<string> } } = {};

    if (!filteredTickets || !events) return [];
    
    filteredTickets.forEach(ticket => {
      const event = events.find(e => e.id === ticket.eventId);
      if (!event) return;

      const purchaseDate = new Date(ticket.purchaseDate);
      // For date ranges less than a year, group by day. Otherwise, group by month.
      const dateDiff = date?.to && date.from ? (date.to.getTime() - date.from.getTime()) / (1000 * 3600 * 24) : 365;
      
      let key: string, shortKey: string;
      if (dateDiff < 365) {
          key = purchaseDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
          shortKey = purchaseDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      } else {
          key = purchaseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
          shortKey = purchaseDate.toLocaleString('default', { month: 'short' });
      }
      
      if (!monthlyData[key]) {
        monthlyData[key] = { month: shortKey, revenue: 0, events: new Set() };
      }
      
      monthlyData[key].revenue += event.price;
      monthlyData[key].events.add(event.id);
    });
    
    const sortedKeys = Object.keys(monthlyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedKeys.map(monthKey => {
      const data = monthlyData[monthKey];
      return {
        month: data.month,
        revenue: data.revenue,
        events: data.events.size,
      }
    });

  }, [filteredTickets, events, date]);

  const eventSalesData = useMemo(() => {
    if (!events || !filteredTickets) return [];

    return events.map(event => {
      const ticketsSold = filteredTickets.filter(ticket => ticket.eventId === event.id).length;
      const revenue = ticketsSold * event.price;
      return {
        id: event.id,
        title: event.title,
        ticketsSold,
        revenue,
      };
    })
    .filter(event => event.ticketsSold > 0) // Only show events with sales in the selected range
    .sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending
  }, [events, filteredTickets]);


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Platform Analytics</h1>
        <div className="grid gap-2">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
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
            <CardDescription>Performance for the selected date range.</CardDescription>
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
              <p>No sales data available for the selected period.</p>
              <p className="text-sm">Try selecting a different date range.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Event-wise Sales Analytics</CardTitle>
          <CardDescription>A breakdown of sales and revenue for each event in the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
          {eventSalesData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Title</TableHead>
                  <TableHead className="text-right">Tickets Sold</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventSalesData.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="text-right">{event.ticketsSold.toLocaleString()}</TableCell>
                    <TableCell className="text-right">Rs. {event.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-16 text-muted-foreground">
              <p>No event sales in the selected period.</p>
              <p className="text-sm">Create events and sell tickets to see data here.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
