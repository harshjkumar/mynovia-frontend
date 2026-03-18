import DressCard from './DressCard'

export default function DressGrid({ dresses = [] }) {
  if (dresses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-body-gray">No dresses found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {dresses.map(dress => (
        <DressCard key={dress.id} dress={dress} />
      ))}
    </div>
  )
}
