export function BidHistory() {
  const bids = [
    {
      id: 1,
      bidder: 'TechLover2024',
      amount: 1450,
      time: '2 hours ago',
      status: 'highest',
    },
    {
      id: 2,
      bidder: 'LaptopHunter',
      amount: 1400,
      time: '3 hours ago',
      status: 'normal',
    },
    {
      id: 3,
      bidder: 'GadgetFan',
      amount: 1350,
      time: '5 hours ago',
      status: 'normal',
    },
    {
      id: 4,
      bidder: 'TechEnthusiast99',
      amount: 1299,
      time: '1 day ago',
      status: 'normal',
    },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Bid History</h3>
      <div className="space-y-4">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              bid.status === 'highest' ? 'bg-accent/10 border border-accent' : 'bg-secondary'
            }`}
          >
            <div>
              <p className={`font-medium text-sm ${bid.status === 'highest' ? 'text-accent' : 'text-foreground'}`}>
                {bid.bidder}
              </p>
              <p className="text-xs text-muted-foreground">{bid.time}</p>
            </div>
            <div>
              <p className={`font-bold text-lg ${bid.status === 'highest' ? 'text-accent' : 'text-primary'}`}>
                ${bid.amount.toLocaleString()}
              </p>
              {bid.status === 'highest' && (
                <p className="text-xs text-accent font-semibold text-right">Highest Bid</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
