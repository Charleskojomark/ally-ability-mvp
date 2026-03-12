'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Loader2 } from 'lucide-react';

interface Props {
  reportId: string;
  currentStatus: string;
}

const statuses = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'escalated', label: 'Escalated' },
];

export default function ReportStatusDropdown({ reportId, currentStatus }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';
      const res = await fetch(apiUrl + '/safety-reports/' + reportId + '/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to update report status.');
    } finally {
      setIsLoading(false);
    }
  };

  const activeLabel = isLoading ? 'Updating…' : 'Update Status';

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 w-full px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {activeLabel}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 z-20 w-40 mt-2 origin-top-right bg-white border border-slate-200 divide-y divide-slate-100 rounded-md shadow-lg outline-none">
            <div className="py-1">
              {statuses.map((s) => {
                const isActive = currentStatus === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => handleUpdate(s.value)}
                    className={
                      'block w-full px-4 py-2 text-sm text-left ' +
                      (isActive
                        ? 'bg-slate-50 text-primary font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900')
                    }
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
