export function StatCard({ label, value, change, icon, gradient }: { 
  label: string; 
  value: string; 
  change?: string; 
  icon?: React.ReactNode;
  gradient?: string;
}) {
  const defaultGradient = "bg-gradient-to-br from-blue-50 to-indigo-100";
  
  return (
    <div className={`${gradient || defaultGradient} border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-2 ${change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
