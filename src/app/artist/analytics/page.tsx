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
import { mockEvents } from '@/lib/mock-data';

const artistEvents = mockEvents.filter(e => e.artistId === 'artist1');

const chartData = artistEvents.map(event => ({
  name: event.title.slice(0, 15) + '...',
  ticketsSold: Math.floor(Math.random() * 500) + 50,
  revenue: event.price * (Math.floor(Math.random() * 500) + 50),
}));

const chartConfig = {
  ticketsSold: {
    label: "Tickets Sold",
    color: "hsl(var(--accent))",
  },
  revenue: {
    label: "Revenue (₹)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ArtistAnalyticsPage() {
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
            <div className="text-2xl font-bold">₹15,200</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,840</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,321</div>
            <p className="text-xs text-muted-foreground">Your fan base</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="font-headline">Per-Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <XAxis dataKey="ticketsSold" type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="ticketsSold" fill="var(--color-ticketsSold)" radius={5} />
                </RechartsBarChart>
            </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
