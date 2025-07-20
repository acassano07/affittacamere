import React, { useState, useEffect } from 'react';
import { Guest, Country, State, DocumentType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { COUNTRIES, STATES, DOCUMENT_TYPES } from '../constants';

interface GuestDetailFormProps {
  guest?: Guest;
  onSave: (guest: Guest) => void;
  onCancel: () => void;
  isMainGuestForm?: boolean; // New prop to indicate if this is for the main guest
}

const GuestDetailForm: React.FC<GuestDetailFormProps> = ({ guest, onSave, onCancel, isMainGuestForm = false }) => {
  const [formData, setFormData] = useState<Guest>(guest || {
    id: uuidv4(),
    firstName: '',
    lastName: '',
    isMainGuest: isMainGuestForm, // Set isMainGuest based on prop
  });

  const [statesOfBirth, setStatesOfBirth] = useState<State[]>([]);
  const [statesOfResidence, setStatesOfResidence] = useState<State[]>([]);

  const documentTypes: DocumentType[] = DOCUMENT_TYPES;

  useEffect(() => {
    if (formData.countryOfBirth?.iso2) {
      setStatesOfBirth(STATES.filter(state => state.iso2.startsWith(formData.countryOfBirth!.iso2.substring(0,2)))); // Simple filtering for demonstration
    } else {
      setStatesOfBirth([]);
    }

    if (formData.countryOfResidence?.iso2) {
      setStatesOfResidence(STATES.filter(state => state.iso2.startsWith(formData.countryOfResidence!.iso2.substring(0,2)))); // Simple filtering for demonstration
    } else {
      setStatesOfResidence([]);
    }
  }, [formData.countryOfBirth, formData.countryOfResidence]);

  useEffect(() => {
    if (guest) {
      setFormData(guest);
    }
  }, [guest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'countryOfBirth') {
      const selectedCountry = COUNTRIES.find(c => c.iso2 === value);
      setFormData(prev => ({
        ...prev,
        countryOfBirth: selectedCountry,
        stateOfBirth: undefined, // Reset state when country changes
      }));
    } else if (name === 'stateOfBirth') {
      const selectedState = STATES.find(s => s.iso2 === value);
      setFormData(prev => ({
        ...prev,
        stateOfBirth: selectedState,
      }));
    } else if (name === 'countryOfResidence') {
      const selectedCountry = COUNTRIES.find(c => c.iso2 === value);
      setFormData(prev => ({
        ...prev,
        countryOfResidence: selectedCountry,
        stateOfResidence: undefined, // Reset state when country changes
      }));
    } else if (name === 'stateOfResidence') {
      const selectedState = STATES.find(s => s.iso2 === value);
      setFormData(prev => ({
        ...prev,
        stateOfResidence: selectedState,
      }));
    } else if (name === 'documentType') {
      setFormData(prev => ({
        ...prev,
        documentType: value as DocumentType,
      }));
    } else if (name === 'documentIssueType') {
      setFormData(prev => ({
        ...prev,
        documentIssueType: value as 'Comune' | 'Nazione',
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner mt-4">
      <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Dettagli Ospite {isMainGuestForm ? '(Principale)' : ''}</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cognome</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sesso</label>
          <select
            name="gender"
            id="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleziona</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data di Nascita</label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        {isMainGuestForm && (
          <>
            <div>
              <label htmlFor="placeOfBirthType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Luogo Nascita</label>
              <select
                name="placeOfBirthType"
                id="placeOfBirthType"
                value={formData.placeOfBirthType || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Seleziona</option>
                <option value="Comune">Comune</option>
                <option value="Stato">Stato</option>
              </select>
            </div>
            {formData.placeOfBirthType === 'Comune' && (
              <div>
                <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comune di Nascita</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  id="placeOfBirth"
                  value={formData.placeOfBirth || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}
            {formData.placeOfBirthType === 'Stato' && (
              <>
                <div>
                  <label htmlFor="countryOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nazione di Nascita</label>
                  <select
                    name="countryOfBirth"
                    id="countryOfBirth"
                    value={formData.countryOfBirth?.iso2 || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleziona Nazione</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.id} value={country.iso2}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.countryOfBirth && (
                  <div>
                    <label htmlFor="stateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provincia/Stato di Nascita</label>
                    <select
                      name="stateOfBirth"
                      id="stateOfBirth"
                      value={formData.stateOfBirth?.iso2 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Seleziona Provincia/Stato</option>
                      {statesOfBirth.map((state) => (
                        <option key={state.id} value={state.iso2}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {!isMainGuestForm && (
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cittadinanza</label>
            <input
              type="text"
              name="nationality"
              id="nationality"
              value={formData.nationality || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}
        <div>
          <label htmlFor="residenceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Residenza</label>
          <select
            name="residenceType"
            id="residenceType"
            value={formData.residenceType || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleziona</option>
            <option value="Comune">Comune</option>
            <option value="Stato">Stato</option>
          </select>
        </div>
        {formData.residenceType === 'Comune' && (
          <div>
            <label htmlFor="residence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comune di Residenza</label>
            <input
              type="text"
              name="residence"
              id="residence"
              value={formData.residence || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}
        {formData.residenceType === 'Stato' && (
          <>
            <div>
              <label htmlFor="countryOfResidence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nazione di Residenza</label>
                  <select
                    name="countryOfResidence"
                    id="countryOfResidence"
                    value={formData.countryOfResidence?.iso2 || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleziona Nazione</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.id} value={country.iso2}>
                        {country.name}
                      </option>
                    ))}
                  </select>
            </div>
            {formData.countryOfResidence && (
              <div>
                <div>
                    <label htmlFor="stateOfResidence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provincia/Stato di Residenza</label>
                    <select
                      name="stateOfResidence"
                      id="stateOfResidence"
                      value={formData.stateOfResidence?.iso2 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Seleziona Provincia/Stato</option>
                      {statesOfResidence.map((state) => (
                        <option key={state.id} value={state.iso2}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
              </div>
            )}
          </>
        )}
        {isMainGuestForm && (
          <>
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Documento</label>
              <select
                name="documentType"
                id="documentType"
                value={formData.documentType || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Seleziona Tipo Documento</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numero Documento</label>
              <input
                type="text"
                name="documentNumber"
                id="documentNumber"
                value={formData.documentNumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {formData.documentType && (
              <>
                <div>
                  <label htmlFor="documentIssueType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Rilascio Documento</label>
                  <select
                    name="documentIssueType"
                    id="documentIssueType"
                    value={formData.documentIssueType || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleziona Tipo Rilascio</option>
                    <option value="Comune">Comune</option>
                    <option value="Nazione">Nazione</option>
                  </select>
                </div>
                {formData.documentIssueType === 'Comune' && (
                  <div>
                    <label htmlFor="documentIssuePlace" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comune Rilascio Documento</label>
                    <input
                      type="text"
                      name="documentIssuePlace"
                      id="documentIssuePlace"
                      value={formData.documentIssuePlace || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                )}
                {formData.documentIssueType === 'Nazione' && (
                  <div>
                    <label htmlFor="documentIssuePlace" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nazione Rilascio Documento</label>
                    <input
                      type="text"
                      name="documentIssuePlace"
                      id="documentIssuePlace"
                      value={formData.documentIssuePlace || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
        <div>
          <label htmlFor="guestType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Ospite</label>
          <select
            name="guestType"
            id="guestType"
            value={formData.guestType || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleziona</option>
            <option value="Adulto">Adulto</option>
            <option value="Bambino">Bambino</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="md:col-span-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salva Ospite
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestDetailForm;