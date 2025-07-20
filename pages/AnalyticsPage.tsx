import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as dateFns from 'date-fns';
import it from 'date-fns/locale/it';
import { Users, Euro, BedDouble, Download } from 'lucide-react';
import { ROOMS } from '../constants';

const AnalyticsPage: React.FC = () => {
  const { bookings } = useData();
  
  const analyticsData = useMemo(() => {
    const totalGuests = bookings.reduce((sum, b) => sum + b.guestsAdults + b.guestsChildren, 0);
    const totalRevenue = bookings.reduce((sum, b) => {
        if(b.customerType === 'Privato') {
            return sum + b.price
        }
        return sum;
    }, 0);

    const monthlyRevenue: { [key: string]: number } = {};
    bookings.forEach(b => {
      if (b.customerType === 'Privato' && b.price > 0) {
        const monthKey = dateFns.format(dateFns.parseISO(b.checkInDate), 'yyyy-MM');
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + b.price;
      }
    });

    const chartData = Object.keys(monthlyRevenue)
        .sort()
        .map(key => ({
            name: dateFns.format(dateFns.parseISO(`${key}-01`), 'MMM yyyy', { locale: it }),
            Guadagni: monthlyRevenue[key],
        }));

    return { totalGuests, totalRevenue, chartData };
  }, [bookings]);

  const handleExport = () => {
    const today = dateFns.startOfToday();
    const arrivals = bookings.filter(b => dateFns.isSameDay(dateFns.parseISO(b.checkInDate), today));
    
    if(arrivals.length === 0){
        alert("Nessun arrivo previsto per oggi.");
        return;
    }

    let exportText = `Schede Notificazione per ${dateFns.format(today, 'dd/MM/yyyy')}\n\n`;
    arrivals.forEach((b, index) => {
        const roomNames = b.assignedRoomIds.map(id => ROOMS.find(r => r.id === id)?.name).filter(Boolean).join(', ');
        exportText += `Ospite ${index + 1}:\n`;
        exportText += `Nome: ${b.name}\n`;
        exportText += `Data Arrivo: ${dateFns.format(dateFns.parseISO(b.checkInDate), 'dd/MM/yyyy')}\n`;
        exportText += `Data Partenza: ${dateFns.format(dateFns.parseISO(b.checkOutDate), 'dd/MM/yyyy')}\n`;
        exportText += `Ospiti: ${b.guestsAdults} Adulti, ${b.guestsChildren} Bambini\n`;
        exportText += `Camere: ${roomNames || 'N/D'}\n\n`;
    });

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notificazioni_${dateFns.format(today, 'yyyy-MM-dd')}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ospiti Totali (storico)</p>
            <p className="text-3xl font-bold text-gray-800">{analyticsData.totalGuests}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <Euro className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ricavi Totali (Privati)</p>
            <p className="text-3xl font-bold text-gray-800">{analyticsData.totalRevenue.toFixed(2)} €</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4">
            <BedDouble className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Prenotazioni Totali</p>
            <p className="text-3xl font-bold text-gray-800">{bookings.length}</p>
          </div>
        </div>
      </div>
      
       {/* PayTourist Export */}
       <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Esportazione Dati</h2>
        <p className="text-gray-600 mb-4">
          Genera un file di testo con gli arrivi di oggi da utilizzare per la notificazione alla questura (es. PayTourist).
        </p>
        <button 
          onClick={handleExport}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          Esporta Arrivi di Oggi
        </button>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: '24rem' }}>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Guadagni Mensili (Clienti Privati)</h2>
        {analyticsData.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={analyticsData.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}€`} tick={{ fontSize: 12 }}/>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} €`, "Guadagni"]}
                  labelStyle={{ fontWeight: 'bold' }}
                  contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="Guadagni" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                Nessun dato sui ricavi disponibile.
            </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;