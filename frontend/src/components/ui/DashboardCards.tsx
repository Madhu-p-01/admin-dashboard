import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ title, value, icon, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-6 shadow-sm",
      className
    )}>
      <div className="flex items-start justify-start mb-4">
        <div className="p-2.5 bg-gray-50 rounded-lg mr-3">
          {icon}
        </div>
      </div>
      
      <div className="mb-1">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">
          {value}
        </div>
        <button className="text-xs text-gray-500 hover:text-gray-700 underline">
          View report
        </button>
      </div>
    </div>
  );
}

interface DateRange {
  start: Date;
  end: Date;
}

// Helpers
function startOfDay(d: Date) { const nd = new Date(d); nd.setHours(0,0,0,0); return nd; }
function formatDisplay(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function daysBetweenInclusive(a: Date, b: Date) {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.floor(ms / 86400000) + 1;
}
function addMonths(d: Date, m: number) { const nd = new Date(d); nd.setMonth(nd.getMonth() + m); return nd; }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth()+1, 0); }
function isSameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function isWithin(d: Date, start: Date, end: Date) { const t = d.getTime(); return t >= start.getTime() && t <= end.getTime(); }

interface DateRangePickerProps {
  value: DateRange;
  onChange: (r: DateRange) => void;
}

function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [calMonth, setCalMonth] = React.useState(startOfMonth(value.end)); 
  const [tempRange, setTempRange] = React.useState<DateRange>(value);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // When opening, sync tempRange
  React.useEffect(() => { if (open) setTempRange(value); }, [open, value]);

  const apply = () => { onChange(tempRange); setOpen(false); };
  const clear = () => { const today = new Date(); const start = new Date(today); start.setDate(today.getDate()-6); onChange({ start, end: today }); setOpen(false); };

  const presets = [
    { label: 'Last 7 days', calc: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate()-6); return { start, end }; } },
    { label: 'Last 30 days', calc: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate()-29); return { start, end }; } },
    { label: 'This Month', calc: () => { const now = new Date(); return { start: startOfMonth(now), end: new Date() }; } },
    { label: 'Last Month', calc: () => { const now = new Date(); const last = addMonths(now, -1); return { start: startOfMonth(last), end: endOfMonth(last) }; } },
    { label: 'Year to Date', calc: () => { const now = new Date(); return { start: new Date(now.getFullYear(),0,1), end: now }; } }
  ];

  function handleDayClick(day: Date) {
    const { start, end } = tempRange;

    if (start && end && isSameDay(start, end) && !isSameDay(day, start)) {
      if (day.getTime() < start.getTime()) {
        setTempRange({ start: day, end: start });
      } else {
        setTempRange({ start, end: day });
      }
      return;
    }

    if (start && end && !isSameDay(start, end)) {
      setTempRange({ start: day, end: day });
      return;
    }

    setTempRange({ start: day, end: day });
  }

  function renderMonth(base: Date) {
    const first = startOfMonth(base);
    const last = endOfMonth(base);
    const days: (Date | null)[] = [];
    const startWeekday = first.getDay(); // 0 Sunday
    for (let i=0;i<startWeekday;i++) days.push(null);
    for (let d=1; d<=last.getDate(); d++) days.push(new Date(base.getFullYear(), base.getMonth(), d));

    const weeks: (Date | null)[][] = [];
    for (let i=0;i<days.length;i+=7) weeks.push(days.slice(i,i+7));

    return (
      <div className="w-64">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700">
            {first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="grid grid-cols-7 text-[10px] font-medium text-gray-500 mb-1">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-0 text-xs">
          {weeks.flat().map((d,i) => {
            if (!d) return <div key={i} className="h-8" />;
            const selStart = isSameDay(d, tempRange.start);
            const selEnd = isSameDay(d, tempRange.end) && !isSameDay(tempRange.start, tempRange.end);
            const fullRangeSelected = !isSameDay(tempRange.start, tempRange.end);
            const definitiveInRange = fullRangeSelected && isWithin(d, tempRange.start, tempRange.end) && !selStart && !selEnd;

            const choosingEnd = isSameDay(tempRange.start, tempRange.end);
            let hoverInRange = false;
            if (choosingEnd && hoverDate) {
              const rangeStart = tempRange.start.getTime() < hoverDate.getTime() ? tempRange.start : hoverDate;
              const rangeEnd = tempRange.start.getTime() < hoverDate.getTime() ? hoverDate : tempRange.start;
              hoverInRange = isWithin(d, rangeStart, rangeEnd) && !isSameDay(d, tempRange.start);
            }

            const isEdge = selStart || selEnd;
            const classes = cn(
              'h-8 w-8 flex items-center justify-center rounded-md relative transition',
              definitiveInRange && 'bg-blue-50 text-blue-700',
              hoverInRange && 'bg-blue-50 text-blue-700',
              isEdge && 'bg-blue-600 text-white font-semibold shadow',
              !definitiveInRange && !hoverInRange && !isEdge && 'hover:bg-gray-100'
            );
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(d)}
                onMouseEnter={() => setHoverDate(d)}
                onFocus={() => setHoverDate(d)}
                className={classes}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const label = `${formatDisplay(value.start)} – ${formatDisplay(value.end)}`;
  const days = daysBetweenInclusive(value.start, value.end);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select date range"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <span className="whitespace-nowrap">{label}</span>
        <span className="text-gray-400">· {days}d</span>
        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Date range picker"
          className="absolute z-20 mt-2 right-0 w-[700px] bg-white border border-gray-200 shadow-lg rounded-lg p-4 animate-fade-in"
        >
          <div className="flex items-start gap-4">
            {/* Presets */}
            <div className="w-44 border-r border-gray-100 pr-4">
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Presets</div>
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => { const today = startOfDay(new Date()); setTempRange({ start: today, end: today }); onChange({ start: today, end: today }); setOpen(false); }}
                    className="w-full text-left text-[11px] px-2 py-1.5 rounded-md hover:bg-gray-100 font-medium text-gray-700"
                  >
                    Today
                  </button>
                </li>
                {presets.map(p => (
                  <li key={p.label}>
                    <button
                      type="button"
                      onClick={() => { const range = p.calc(); setTempRange(range); onChange(range); setOpen(false); }}
                      className="w-full text-left text-[11px] px-2 py-1.5 rounded-md hover:bg-gray-100 font-medium text-gray-700"
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Calendars */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => setCalMonth(m => addMonths(m,-1))}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => setCalMonth(m => addMonths(m,1))}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">Select start then end date</div>
              </div>
              <div className="flex gap-6">
                {renderMonth(calMonth)}
                {renderMonth(addMonths(calMonth,1))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                <div className="flex gap-2">
                  <button type="button" onClick={clear} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md">Reset</button>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button
                    type="button"
                    onClick={apply}
                    disabled={isSameDay(tempRange.start, tempRange.end)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-semibold rounded-md shadow',
                      isSameDay(tempRange.start, tempRange.end)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    )}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardCards() {
  // Default: last 7 days inclusive
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const initialStart = React.useMemo(() => { const d = new Date(today); d.setDate(today.getDate()-6); return d; }, [today]);
  const [dateRange, setDateRange] = React.useState<DateRange>({ start: initialStart, end: today });

  const formatNumber = (n: number) => n.toLocaleString('en-IN');

  const baseline = React.useMemo(() => ({
    netIncome: 7825/7, 
    sessions: 17825/7, 
    orders: 740/7,    
    conversion: 28   
  }), []);

  const derivedMetrics = React.useMemo(() => {
    const days = Math.max(1, daysBetweenInclusive(dateRange.start, dateRange.end));
    const netIncome = Math.round(baseline.netIncome * days);
    const sessions = Math.round(baseline.sessions * days);
    const orders = Math.round(baseline.orders * days);
    const convDrop = Math.min( (days-7)/30 * 2, 10 );
    const conversion = Math.max(15, Math.round(baseline.conversion - convDrop));
    return { days, netIncome, sessions, orders, conversion };
  }, [baseline, dateRange]);

  const RangeControl = (
    <div className="flex items-center gap-3">
      <DateRangePicker value={dateRange} onChange={setDateRange} />
    </div>
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Performance Overview</h2>
        {RangeControl}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net Income"
          value={`₹${formatNumber(derivedMetrics.netIncome)}`}
          icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Total Sessions"
          value={formatNumber(derivedMetrics.sessions)}
          icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <StatCard
          title="Orders"
          value={formatNumber(derivedMetrics.orders)}
          icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard
          title="Conversion"
          value={`${derivedMetrics.conversion}%`}
          icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
        />
      </div>
    </div>
  );
}
