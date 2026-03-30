import PublicListingsPage from '@/components/listings/PublicListingsPage'
import type { PropertySearchParamsInput } from '@/lib/property-search'

export default async function RentPage(props: {
  searchParams?: Promise<PropertySearchParamsInput>
}) {
  const searchParams = (await props.searchParams) ?? {}
  return <PublicListingsPage mode="rent" searchParams={searchParams} />
}
