import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../services/geminiService';
import { DataRow } from '../App';

interface ChartRendererProps {
  chartInfo: AnalysisResult['suggestedChart'];
  data: DataRow[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

const processDataForCharting = (data: DataRow[], xKey: string, yKey: string): DataRow[] => {
  return data.map(row => ({
    ...row,
    [yKey]: parseFloat(String(row[yKey]).replace(/[^0-9.-]+/g, '')) || 0,
    [xKey]: row[xKey]
  })).filter(row => row[yKey] !== null && !isNaN(Number(row[yKey])));
};


export const ChartRenderer: React.FC<ChartRendererProps> = ({ chartInfo, data }) => {
    
    if (!chartInfo || !data || data.length === 0) {
        return <p className="text-text-secondary text-center">Não há dados para exibir o gráfico.</p>;
    }

    const { type, title, x_axis_column, y_axis_column } = chartInfo;

    const firstRow = data[0];
    if (!firstRow.hasOwnProperty(x_axis_column) || !firstRow.hasOwnProperty(y_axis_column)) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                <p className="font-bold">Aviso de Gráfico</p>
                <p>A IA sugeriu um gráfico com colunas ('{x_axis_column}', '{y_axis_column}') que não foram encontradas nos dados. A visualização não pôde ser gerada.</p>
            </div>
        );
    }

    const processedData = processDataForCharting(data, x_axis_column, y_axis_column);

    if (processedData.length === 0) {
       return <p className="text-text-secondary text-center">Os dados para o gráfico não puderam ser processados.</p>;
    }
    
    const renderChart = () => {
        const tooltipStyle = { 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb',
            color: '#111827',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        };

        switch (type.toUpperCase()) {
            case 'BAR':
                return (
                    <BarChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey={x_axis_column} stroke="#6b7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}/>
                        <Legend />
                        <Bar dataKey={y_axis_column} name={y_axis_column} fill="#3b82f6" />
                    </BarChart>
                );
            case 'LINE':
                return (
                    <LineChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey={x_axis_column} stroke="#6b7280" tick={{ fontSize: 12 }}/>
                        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }}/>
                        <Tooltip contentStyle={tooltipStyle} cursor={{stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3'}}/>
                        <Legend />
                        <Line type="monotone" dataKey={y_axis_column} name={y_axis_column} stroke="#8b5cf6" activeDot={{ r: 8 }} />
                    </LineChart>
                );
             case 'PIE':
                const pieData = processedData.map(d => ({ name: d[x_axis_column], value: d[y_axis_column] as number}));
                return (
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            // FIX: Explicitly convert `percent` to a number to avoid a TypeScript error where it might be inferred as a string.
                            label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                            stroke="#ffffff"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                    </PieChart>
                );
            default:
                return <p className="text-text-secondary text-center">Tipo de gráfico '{type}' não suportado.</p>;
        }
    };

    return (
        <div className="w-full h-96 flex flex-col items-center">
            <h3 className="text-md font-semibold text-text mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};