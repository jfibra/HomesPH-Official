'use client'

import { Building2, Home, LayoutGrid, Wallet } from 'lucide-react'
import KpiCard from '@/components/dashboard/KpiCard'
import DataTable from '@/components/dashboard/DataTable'
import StatusBadge from '@/components/dashboard/StatusBadge'
import type { RoleUnitRow } from '@/lib/role-dashboard-data'

export default function RoleUnitsModuleClient({ title, description, units }: { title: string; description: string; units: RoleUnitRow[] }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard title="Units" value={units.length} icon={LayoutGrid} iconColor="text-blue-700" iconBg="bg-blue-50" />
        <KpiCard title="Projects" value={new Set(units.map((unit) => unit.project_name).filter(Boolean)).size} icon={Building2} iconColor="text-emerald-700" iconBg="bg-emerald-50" />
        <KpiCard title="Available" value={units.filter((unit) => (unit.status ?? '').toLowerCase() === 'available').length} icon={Home} iconColor="text-amber-700" iconBg="bg-amber-50" />
        <KpiCard title="RFO" value={units.filter((unit) => Boolean(unit.is_rfo)).length} icon={Wallet} iconColor="text-slate-700" iconBg="bg-slate-100" />
      </div>

      <DataTable
        title="Project Units"
        data={units.map((unit) => ({
          unit: unit.unit_name || unit.unit_type,
          project: unit.project_name ?? 'Unassigned',
          type: unit.unit_type,
          bedrooms: unit.bedrooms ?? 0,
          price: unit.selling_price ? `PHP ${Number(unit.selling_price).toLocaleString()}` : 'Price on request',
          status: unit.status ?? 'Draft',
        }))}
        columns={[
          { key: 'unit', label: 'Unit' },
          { key: 'project', label: 'Project' },
          { key: 'type', label: 'Type' },
          { key: 'bedrooms', label: 'Beds' },
          { key: 'price', label: 'Price', sortable: false },
          { key: 'status', label: 'Status', render: (value) => <StatusBadge status={String(value)} /> },
        ]}
      />
    </div>
  )
}