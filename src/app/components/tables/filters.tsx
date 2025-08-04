'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  setCpfFilter,
  setValorMin,
  setValorMax,
  setDataInicio,
  setDataFim,
  setColumnFilters,
} from '@/redux/transactionTableSlice';

interface FiltersProps {
  isTransfer: boolean;
  table: any;
}

export default function Filters({ isTransfer, table }: FiltersProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const cpfFilter = useSelector((state: RootState) => state.transactionTable.cpfFilter);
  const valorMin = useSelector((state: RootState) => state.transactionTable.valorMin);
  const valorMax = useSelector((state: RootState) => state.transactionTable.valorMax);
  const dataInicio = useSelector((state: RootState) => state.transactionTable.dataInicio);
  const dataFim = useSelector((state: RootState) => state.transactionTable.dataFim);

  const updateQueryParam = (key: string, value: string) => {
    const newQuery = { ...router.query, [key]: value, page: 1 };
    if (!value) delete newQuery[key];
    router.push({ pathname: '/transactions', query: newQuery });
  };

  const limparFiltros = () => {
    dispatch(setValorMin(''));
    dispatch(setValorMax(''));
    dispatch(setDataInicio(''));
    dispatch(setDataFim(''));
    dispatch(setCpfFilter(''));
    dispatch(setColumnFilters([]));

    router.push({ pathname: '/transactions', query: { page: 1 } });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 mt-10 items-center">
      {/* FILTRO TIPO */}
      <div className="flex flex-col">
        <label htmlFor="filtro-tipo" className="font-semibold text-sm mb-1 text-primary">Tipo</label>
        <select
          id="filtro-tipo"
          className="border px-3 py-2 rounded w-48"
          value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
          onChange={(e) => {
            const tipo = e.target.value || undefined;
            table.getColumn('type')?.setFilterValue(tipo);
            updateQueryParam('type', e.target.value);
          }}
        >
          <option value="">Todos os tipos</option>
          {['Depósito', 'Saque', 'Transferência'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* FILTRO CPF */}
      {isTransfer && (
        <div className="flex flex-col">
          <label htmlFor="cpf-filter" className="font-semibold text-sm mb-1 text-primary">Filtrar por CPF</label>
          <input
            id="cpf-filter"
            type="text"
            value={cpfFilter}
            onChange={(e) => {
              const val = e.target.value;
              dispatch(setCpfFilter(val));
              table.getColumn('cpfFilter')?.setFilterValue(val || undefined);
              updateQueryParam('search', val);
            }}
            className="border rounded px-3 py-2 w-48"
            aria-label="Filtro por CPF origem ou destino"
          />
        </div>
      )}

      {/* FILTRO VALOR MÍNIMO */}
      <div className="flex flex-col">
        <label htmlFor="valor-min" className="font-semibold text-sm mb-1 text-primary">Valor mínimo</label>
        <input
          id="valor-min"
          type="number"
          min={0}
          step={0.01}
          value={valorMin}
          onChange={(e) => {
            const val = e.target.value;
            dispatch(setValorMin(val));
            updateQueryParam('valorMin', val);
          }}
          className="border rounded px-3 py-2 w-32"
          aria-label="Filtro valor mínimo"
        />
      </div>

      {/* FILTRO VALOR MÁXIMO */}
      <div className="flex flex-col">
        <label htmlFor="valor-max" className="font-semibold text-sm mb-1 text-primary">Valor máximo</label>
        <input
          id="valor-max"
          type="number"
          min={0}
          step={0.01}
          value={valorMax}
          onChange={(e) => {
            const val = e.target.value;
            dispatch(setValorMax(val));
            updateQueryParam('valorMax', val);
          }}
          className="border rounded px-3 py-2 w-32"
          aria-label="Filtro valor máximo"
        />
      </div>

      {/* FILTRO DATA INÍCIO */}
      <div className="flex flex-col">
        <label htmlFor="data-inicio" className="font-semibold text-sm mb-1 text-primary">Data início</label>
        <input
          id="data-inicio"
          type="date"
          className="border rounded px-3 py-2"
          value={dataInicio}
          onChange={(e) => {
            const val = e.target.value;
            dispatch(setDataInicio(val));
            updateQueryParam('dataInicio', val);
          }}
          aria-label="Filtro data início"
        />
      </div>

      {/* FILTRO DATA FIM */}
      <div className="flex flex-col">
        <label htmlFor="data-fim" className="font-semibold text-sm mb-1 text-primary">Data fim</label>
        <input
          id="data-fim"
          type="date"
          className="border rounded px-3 py-2"
          value={dataFim}
          onChange={(e) => {
            const val = e.target.value;
            dispatch(setDataFim(val));
            updateQueryParam('dataFim', val);
          }}
          aria-label="Filtro data fim"
        />
      </div>

      {/* BOTÃO LIMPAR FILTROS */}
      <div className="ml-auto">
        <button
          onClick={limparFiltros}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
          aria-label="Limpar filtros"
          type="button"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
}
