'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppWrapper from './AppWrapper';

export default function SAPApp() {
  const [pipelineState, setPipelineState] = useState(0); // 0-4
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');

  useEffect(() => {
    if (pipelineState < 4) {
      const timer = setTimeout(() => {
        setPipelineState(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pipelineState]);

  const pipelineSteps = ['Init', 'Build', 'Test', 'Deploy', 'Success'];
  
  const mockData = [
    { id: 'PO-9921', vendor: 'Global Tech', amount: 12500, status: 'Approved' },
    { id: 'PO-9922', vendor: 'Logistics Inc', amount: 3400, status: 'Pending' },
    { id: 'PO-9923', vendor: 'Consulting Group', amount: 28000, status: 'Blocked' },
  ];

  return (
    <AppWrapper
      title="SAP // Enterprise Data"
      subtitle="B2B Infrastructure & CI/CD Tooling"
      brandColor="#008FD3"
    >
      <div className="p-4 flex flex-col gap-6 h-full font-sans bg-[#F8FAFC] text-slate-800">
        
        {/* ─── CI/CD Pipeline Modulet ─── */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cypress.js CI/CD Pipeline</h3>
            {pipelineState === 4 && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[11px] font-bold text-[#008FD3] bg-[#008FD3]/10 px-2 py-1 rounded-md"
              >
                15% Accelerated Deployment Cycle
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0" />
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#008FD3] rounded-full z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(pipelineState / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            {pipelineSteps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-1">
                <motion.div 
                  className={`w-4 h-4 rounded-full border-2 ${pipelineState >= idx ? 'bg-[#008FD3] border-[#008FD3]' : 'bg-white border-slate-300'}`}
                  initial={false}
                  animate={{ scale: pipelineState === idx ? 1.2 : 1 }}
                />
                <span className={`text-[9px] font-bold uppercase ${pipelineState >= idx ? 'text-[#008FD3]' : 'text-slate-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Functional Data Table ─── */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-xs font-bold text-slate-600">Line Items</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrency('USD')}
                className={`text-[10px] px-2 py-1 rounded font-bold ${currency === 'USD' ? 'bg-[#008FD3] text-white' : 'bg-slate-200 text-slate-500'}`}
              >
                USD
              </button>
              <button 
                onClick={() => setCurrency('EUR')}
                className={`text-[10px] px-2 py-1 rounded font-bold ${currency === 'EUR' ? 'bg-[#008FD3] text-white' : 'bg-slate-200 text-slate-500'}`}
              >
                EUR
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="font-semibold p-3">PO Number</th>
                  <th className="font-semibold p-3">Vendor</th>
                  <th className="font-semibold p-3 text-right">Amount</th>
                  <th className="font-semibold p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{row.id}</td>
                    <td className="p-3 font-medium text-slate-700">{row.vendor}</td>
                    <td className="p-3 font-mono text-right text-slate-600">
                      {currency === 'USD' ? '$' : '€'}
                      {(currency === 'EUR' ? row.amount * 0.92 : row.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                        ${row.status === 'Approved' ? 'bg-green-100 text-green-700' : ''}
                        ${row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${row.status === 'Blocked' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppWrapper>
  );
}
