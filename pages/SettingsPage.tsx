import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Settings, Closure } from '../types';
import { ROOMS } from '../constants';
import { Save, DollarSign, PlusCircle, Trash2, X, Building, Bed } from 'lucide-react';
import * as dateFns from 'date-fns';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, closures, addClosure, deleteClosure } = useData();
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSavePrices = () => {
    updateSettings(currentSettings);
    alert('Prezzi salvati con successo!');
  };

  const ClosureModal: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [newClosure, setNewClosure] = useState({
        roomId: 'all' as number | 'all',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleClosureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewClosure(prev => ({...prev, [name]: value}));
    }

    const handleAddClosure = () => {
        if(newClosure.startDate && newClosure.endDate && newClosure.reason) {
            addClosure({
                ...newClosure,
                roomId: newClosure.roomId === 'all' ? 'all' : Number(newClosure.roomId),
            });
            onClose();
        } else {
            alert('Per favore, compila tutti i campi per la chiusura.');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Chiudi Camere/Struttura</h3>
                    <button onClick={onClose}><X size={24}/></button>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Camera/Struttura</label>
                        <select name="roomId" value={newClosure.roomId} onChange={handleClosureChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                            <option value="all">Intera Struttura</option>
                            {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Data Inizio</label>
                        <input type="date" name="startDate" value={newClosure.startDate} onChange={handleClosureChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Data Fine</label>
                        <input type="date" name="endDate" value={newClosure.endDate} onChange={handleClosureChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Motivo</label>
                        <textarea name="reason" value={newClosure.reason} onChange={handleClosureChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md">Annulla</button>
                        <button onClick={handleAddClosure} className="bg-blue-600 text-white px-4 py-2 rounded-md">Aggiungi Chiusura</button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Impostazioni</h1>

      {/* Price Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <DollarSign className="h-6 w-6 mr-2 text-green-500" />
          Gestione Prezzi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-700">Prezzo camera singola</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input type="number" name="priceSingleRoom" value={currentSettings.priceSingleRoom} onChange={handlePriceChange} className="block w-full rounded-md border-gray-300 pl-4 pr-12 p-2" placeholder="0.00" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prezzo camera matrimoniale (2 adulti)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input type="number" name="basePriceDoubleRoom" value={currentSettings.basePriceDoubleRoom} onChange={handlePriceChange} className="block w-full rounded-md border-gray-300 pl-4 pr-12 p-2" placeholder="0.00" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prezzo per terzo adulto</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input type="number" name="priceThirdAdult" value={currentSettings.priceThirdAdult} onChange={handlePriceChange} className="block w-full rounded-md border-gray-300 pl-4 pr-12 p-2" placeholder="0.00" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prezzo per quarto adulto</label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <input type="number" name="priceFourthAdult" value={currentSettings.priceFourthAdult} onChange={handlePriceChange} className="block w-full rounded-md border-gray-300 pl-4 pr-12 p-2" placeholder="0.00" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Prezzo per bambino (&lt; 12 anni)</label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <input type="number" name="priceChild" value={currentSettings.priceChild} onChange={handlePriceChange} className="block w-full rounded-md border-gray-300 pl-4 pr-12 p-2" placeholder="0.00" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSavePrices} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Save className="h-5 w-5 mr-2" />
            Salva Prezzi
          </button>
        </div>
      </div>

      {/* Closures Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Gestione Chiusure</h2>
            <button onClick={() => setIsClosureModalOpen(true)} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Nuova Chiusura
            </button>
        </div>
        <div className="space-y-3">
            {closures.length > 0 ? closures.map(closure => (
                <div key={closure.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-4 ${closure.roomId === 'all' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                           {closure.roomId === 'all' ? <Building className="h-5 w-5 text-red-600"/> : <Bed className="h-5 w-5 text-yellow-600"/>}
                        </div>
                        <div>
                            <p className="font-semibold">{closure.roomId === 'all' ? 'Intera Struttura' : ROOMS.find(r => r.id === closure.roomId)?.name}</p>
                            <p className="text-sm text-gray-600">
                                {dateFns.format(dateFns.parseISO(closure.startDate), 'dd/MM/yy')} - {dateFns.format(dateFns.parseISO(closure.endDate), 'dd/MM/yy')}
                            </p>
                            <p className="text-sm text-gray-500 italic">{closure.reason}</p>
                        </div>
                    </div>
                    <button onClick={() => deleteClosure(closure.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 />
                    </button>
                </div>
            )) : <p className="text-gray-500 text-center py-4">Nessuna chiusura programmata.</p>}
        </div>
      </div>
      {isClosureModalOpen && <ClosureModal onClose={() => setIsClosureModalOpen(false)} />}
    </div>
  );
};

export default SettingsPage;