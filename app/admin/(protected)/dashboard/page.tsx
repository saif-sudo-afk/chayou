import Link from "next/link";
import { DollarSign, Gem, PackageCheck, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminDashboardData } from "@/lib/queries";
import { formatDateTime, formatMAD } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const { stats, recentOrders } = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        description="A quick view of CHAYOU orders, catalog health, and revenue."
        title="Dashboard"
      />

      <div className="grid gap-5 xl:grid-cols-4">
        <StatsCard
          description="Total orders placed"
          icon={ShoppingBag}
          title="Orders"
          value={String(stats.totalOrders)}
        />
        <StatsCard
          description="Awaiting confirmation"
          icon={PackageCheck}
          title="Pending"
          value={String(stats.pendingOrders)}
        />
        <StatsCard
          description="Non-cancelled revenue"
          icon={DollarSign}
          title="Revenue"
          value={formatMAD(stats.totalRevenue)}
        />
        <StatsCard
          description="Visible on storefront"
          icon={Gem}
          title="Active Products"
          value={String(stats.activeProducts)}
        />
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl tracking-[0.08em] text-brand">
                Recent Orders
              </h2>
              <p className="text-sm text-muted">
                The latest customer activity across Morocco.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text">{order.customerName}</p>
                        <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    <TableCell>{order.customerCity}</TableCell>
                    <TableCell className="text-gold">{formatMAD(order.totalAmount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/admin/orders/${order.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
