export function BidHistory({ bids }: { bids: any[] }) {
  const sortedBids = [...(bids || [])].sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Bid History</h3>
      <div className="space-y-4">
        {sortedBids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0 ? 'bg-accent/10 border border-accent' : 'bg-secondary'
            }`}
          >
            <div>
              <p className={`font-medium text-sm ${index === 0 ? 'text-accent' : 'text-foreground'}`}>
                User_{bid.bidder_id.substring(0, 5)}
              </p>
              <p className="text-xs text-muted-foreground">{new Date(bid.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className={`font-bold text-lg ${index === 0 ? 'text-accent' : 'text-primary'}`}>
                LKR {bid.amount.toLocaleString()}
              </p>
              {index === 0 && (
                <p className="text-xs text-accent font-semibold text-right">Highest Bid</p>
              )}
            </div>
          </div>
        ))}
        {sortedBids.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No bids yet. Be the first to bid!</p>
        )}
      </div>
    </div>
  )
}
