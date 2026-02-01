import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '/pages/LoginPage.js';
import DashboardPage from '/pages/DashboardPage.js';
import ClientsHistoryPage from '/pages/ClientsHistoryPage.js';
import NewClientPage from '/pages/NewClientPage.js';
import ExpenseManagementPage from '/pages/ExpenseManagementPage.js';
import PaymentsPage from '/pages/PaymentsPage.js';
import SettingsPage from '/pages/SettingsPage.js';
import BusinessExpensesPage from '/pages/BusinessExpensesPage.js';
import { gasApi } from '/api.js';

const STORAGE_KEY = 'harmony_glass_clients_v4';
const HISTORY_KEY = 'harmony_glass_history_v4';
const SESSION_KEY = 'harmony_glass_session';
const USER_KEY = 'harmony_glass_username';

const App = () => {
  const [userRole, setUserRole] = useState(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return sessionStorage.getItem(USER_KEY) || '';
  });

  const [activeClients, setActiveClients] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return []; 
  });

  const [historyClients, setHistoryClients] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    const syncData = async () => {
      try {
        const response = await gasApi.call('GET_ALL_DATA');
        if (response.success && response.clients) {
          setActiveClients(response.clients);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.clients));
        }
      } catch (err) {
        console.warn("No se pudo sincronizar con GAS, usando datos locales.");
      }
    };
    if (userRole) syncData();
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeClients));
  }, [activeClients]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyClients));
  }, [historyClients]);

  const handleLogin = (role, username) => {
    setCurrentUser(username);
    setUserRole(role);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUserRole(null);
    setCurrentUser('');
  };

  const handleAddClient = async (newClient) => {
    setActiveClients(prev => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
    await gasApi.call('SAVE_CLIENT', { client: newClient });
  };

  const handleUpdateClient = async (updatedClient) => {
    setActiveClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    await gasApi.call('SAVE_CLIENT', { client: updatedClient });
  };

  const handleDeleteActiveClient = async (id) => {
    const clientToArchive = activeClients.find(c => c.id === id);
    if (!clientToArchive) return;

    const archivedClient = {
      ...clientToArchive,
      status: "Finalizado",
      end: new Date().toLocaleDateString()
    };
    
    setHistoryClients(prev => [archivedClient, ...prev]);
    setActiveClients(prev => prev.filter(c => c.id !== id));
    await gasApi.call('ARCHIVE_CLIENT', { clientId: id });
  };

  const handleDeleteHistoryClient = (id) => {
    setHistoryClients(prev => prev.filter(c => c.id !== id));
  };

  const getSelectedClient = () => {
    return activeClients.find(c => c.id === selectedClientId) || null;
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={
          userRole ? (
            <DashboardPage 
              readonly={userRole === 'basic'} 
              clients={activeClients} 
              onSelectClient={setSelectedClientId} 
              onDeleteClient={userRole === 'admin' ? handleDeleteActiveClient : undefined}
            />
          ) : <Navigate to="/" />
        } />
        <Route path="/clients" element={
          userRole ? <ClientsHistoryPage archivedClients={historyClients} onDeleteHistory={userRole === 'admin' ? handleDeleteHistoryClient : undefined} /> : <Navigate to="/" />
        } />
        <Route path="/new-client" element={userRole === 'admin' ? <NewClientPage onAddClient={handleAddClient} /> : <Navigate to="/dashboard" />} />
        <Route path="/expense-management" element={
          userRole ? <ExpenseManagementPage readonly={userRole === 'basic'} clientData={getSelectedClient()} onUpdateClient={handleUpdateClient} /> : <Navigate to="/" />
        } />
        <Route path="/payments" element={userRole ? <PaymentsPage clients={activeClients} /> : <Navigate to="/" />} />
        <Route path="/business-expenses" element={userRole ? <BusinessExpensesPage username={currentUser} /> : <Navigate to="/" />} />
        <Route path="/settings" element={userRole ? <SettingsPage onLogout={handleLogout} role={userRole} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};
