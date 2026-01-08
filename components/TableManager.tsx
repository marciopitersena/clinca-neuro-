
import React, { useState } from 'react';

interface TableProps {
  title: string;
  description: string;
  headers: string[];
  data: any[];
  onAdd: () => void;
  renderRow: (item: any) => React.ReactNode;
}

export const GenericTable: React.FC<TableProps> = ({ title, description, headers, data, onAdd, renderRow }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 text-sm">{description}</p>
        </div>
        <button 
          onClick={onAdd}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <span>➕</span> Novo Registro
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((item, i) => renderRow(item))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="px-6 py-12 text-center text-slate-400 italic">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
