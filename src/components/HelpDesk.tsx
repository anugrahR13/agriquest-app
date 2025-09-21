import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  sender: {
    firstName: string;
    lastName: string;
    role: string;
  };
  createdAt: string;
}

const HelpDesk: React.FC = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/help-desk/tickets');
      // const data = await response.json();
      // setTickets(data.tickets);
      
      // Mock data for now
      setTickets([
        {
          id: '1',
          title: 'Issue with crop tracking feature',
          description: 'The growth stage tracking is not updating properly',
          status: 'OPEN',
          priority: 'MEDIUM',
          createdAt: '2023-10-20T10:30:00Z',
          messages: [
            {
              id: '1',
              content: 'I am experiencing issues with the crop tracking feature. The growth stages are not updating automatically.',
              sender: {
                firstName: 'Farmer',
                lastName: 'User',
                role: 'FARMER'
              },
              createdAt: '2023-10-20T10:30:00Z'
            },
            {
              id: '2',
              content: 'Thank you for reporting this issue. Our team is investigating and will get back to you soon.',
              sender: {
                firstName: 'Support',
                lastName: 'Agent',
                role: 'ADMIN'
              },
              createdAt: '2023-10-20T11:15:00Z'
            }
          ]
        }
      ]);
    } catch (err) {
      setError(t('helpDesk.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) return;
    
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/help-desk/tickets', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     title: newTicketTitle,
      //     description: newTicketDescription,
      //     priority: 'MEDIUM'
      //   })
      // });
      // const data = await response.json();
      
      // Mock implementation
      const newTicket: Ticket = {
        id: `${tickets.length + 1}`,
        title: newTicketTitle,
        description: newTicketDescription,
        status: 'OPEN',
        priority: 'MEDIUM',
        createdAt: new Date().toISOString(),
        messages: []
      };
      
      setTickets([newTicket, ...tickets]);
      setNewTicketTitle('');
      setNewTicketDescription('');
    } catch (err) {
      setError(t('helpDesk.createError'));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch(`/api/help-desk/tickets/${selectedTicket.id}/messages`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newMessage })
      // });
      // const data = await response.json();
      
      // Mock implementation
      const updatedTicket = {
        ...selectedTicket,
        messages: [
          ...selectedTicket.messages,
          {
            id: `${selectedTicket.messages.length + 1}`,
            content: newMessage,
            sender: {
              firstName: 'Farmer',
              lastName: 'User',
              role: 'FARMER'
            },
            createdAt: new Date().toISOString()
          }
        ]
      };
      
      setSelectedTicket(updatedTicket);
      setNewMessage('');
      
      // Update in the tickets list
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
    } catch (err) {
      setError(t('helpDesk.sendMessageError'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">{t('error')}:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('helpDesk.title')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('helpDesk.newTicket')}</h3>
            <form onSubmit={createTicket} className="space-y-3">
              <input
                type="text"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                placeholder={t('helpDesk.ticketTitle')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                value={newTicketDescription}
                onChange={(e) => setNewTicketDescription(e.target.value)}
                placeholder={t('helpDesk.ticketDescription')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {t('helpDesk.submitTicket')}
              </button>
            </form>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('helpDesk.myTickets')}</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedTicket?.id === ticket.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800 truncate">{ticket.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Ticket Details */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="h-full flex flex-col">
              <div className="border-b pb-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedTicket.title}</h3>
                    <div className="flex space-x-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{selectedTicket.description}</p>
              </div>
              
              <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.sender.role === 'ADMIN' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">
                        {message.sender.firstName} {message.sender.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                ))}
              </div>
              
              <form onSubmit={sendMessage} className="mt-auto">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('helpDesk.typeMessage')}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50"
                  >
                    {t('helpDesk.send')}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {t('helpDesk.selectTicket')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpDesk;