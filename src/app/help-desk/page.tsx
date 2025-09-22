'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Paperclip,
  Mic,
  Leaf,
  Target,
  Sprout
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    name: string;
    avatar?: string;
  };
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: 'FARMER' | 'MENTOR' | 'ADMIN';
    avatar?: string;
  };
  createdAt: string;
  isRead: boolean;
}

export default function HelpDeskPage() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  });
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
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
          title: 'Issue with drip irrigation system',
          description: 'Water pressure is low in my drip irrigation system. Need guidance on troubleshooting.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          category: 'Irrigation',
          createdAt: '2023-10-20T10:30:00Z',
          updatedAt: '2023-10-21T14:20:00Z',
          assignedTo: {
            name: 'Rajesh Kumar',
            avatar: ''
          },
          messages: [
            {
              id: '1',
              content: 'I am experiencing low water pressure in my drip irrigation system. What should I check first?',
              sender: {
                id: 'farmer1',
                name: 'Farmer User',
                role: 'FARMER'
              },
              createdAt: '2023-10-20T10:30:00Z',
              isRead: true
            },
            {
              id: '2',
              content: 'Check for clogged emitters and inspect the main filter. Also verify the water source pressure.',
              sender: {
                id: 'mentor1',
                name: 'Rajesh Kumar',
                role: 'MENTOR'
              },
              createdAt: '2023-10-20T11:15:00Z',
              isRead: true
            },
            {
              id: '3',
              content: 'I checked the filter and it was clogged. Cleaned it and pressure is better now. Thanks!',
              sender: {
                id: 'farmer1',
                name: 'Farmer User',
                role: 'FARMER'
              },
              createdAt: '2023-10-20T14:30:00Z',
              isRead: false
            }
          ]
        },
        {
          id: '2',
          title: 'Pest control for cotton crop',
          description: 'Noticed whiteflies on my cotton plants. Need organic solution.',
          status: 'OPEN',
          priority: 'MEDIUM',
          category: 'Pest Control',
          createdAt: '2023-10-21T09:15:00Z',
          updatedAt: '2023-10-21T09:15:00Z',
          messages: [
            {
              id: '1',
              content: 'Noticed whiteflies on my cotton plants. What organic solutions do you recommend?',
              sender: {
                id: 'farmer1',
                name: 'Farmer User',
                role: 'FARMER'
              },
              createdAt: '2023-10-21T09:15:00Z',
              isRead: false
            }
          ]
        },
        {
          id: '3',
          title: 'Soil testing guidance',
          description: 'Need help interpreting soil test results for my wheat field.',
          status: 'RESOLVED',
          priority: 'LOW',
          category: 'Soil Health',
          createdAt: '2023-10-18T11:45:00Z',
          updatedAt: '2023-10-19T16:30:00Z',
          assignedTo: {
            name: 'Priya Sharma',
            avatar: ''
          },
          messages: [
            {
              id: '1',
              content: 'I got my soil test results but need help interpreting them for my wheat field.',
              sender: {
                id: 'farmer1',
                name: 'Farmer User',
                role: 'FARMER'
              },
              createdAt: '2023-10-18T11:45:00Z',
              isRead: true
            },
            {
              id: '2',
              content: 'Please share your soil test report. I\'ll help you understand the nutrient levels and recommendations.',
              sender: {
                id: 'mentor1',
                name: 'Priya Sharma',
                role: 'MENTOR'
              },
              createdAt: '2023-10-18T12:20:00Z',
              isRead: true
            },
            {
              id: '3',
              content: 'Attached the report. The pH is 7.2, nitrogen is low, phosphorus is adequate, potassium is high.',
              sender: {
                id: 'farmer1',
                name: 'Farmer User',
                role: 'FARMER'
              },
              createdAt: '2023-10-18T13:10:00Z',
              isRead: true
            },
            {
              id: '4',
              content: 'Based on the results, I recommend adding nitrogen-rich compost and reducing potassium fertilizer.',
              sender: {
                id: 'mentor1',
                name: 'Priya Sharma',
                role: 'MENTOR'
              },
              createdAt: '2023-10-19T16:30:00Z',
              isRead: true
            }
          ]
        }
      ]);
    } catch (err) {
      setError(t('helpDesk.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;
    
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/help-desk/tickets', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newTicket)
      // });
      // const data = await response.json();
      
      // Mock implementation
      const createdTicket: Ticket = {
        id: `${tickets.length + 1}`,
        ...newTicket,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: '1',
            content: newTicket.description,
            sender: {
              id: 'farmer1',
              name: 'Farmer User',
              role: 'FARMER'
            },
            createdAt: new Date().toISOString(),
            isRead: false
          }
        ]
      };
      
      setTickets([createdTicket, ...tickets]);
      setShowNewTicket(false);
      setNewTicket({
        title: '',
        description: '',
        category: 'General',
        priority: 'MEDIUM'
      });
    } catch (err) {
      setError(t('helpDesk.createError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
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
      const message: Message = {
        id: `${selectedTicket.messages.length + 1}`,
        content: newMessage,
        sender: {
          id: 'farmer1',
          name: 'Farmer User',
          role: 'FARMER'
        },
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      const updatedTicket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, message],
        updatedAt: new Date().toISOString()
      };
      
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      setNewMessage('');
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <strong className="font-bold">{t('common.error')}: </strong>
          </div>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="touch-target">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{t('helpDesk.title')}</h1>
              <p className="text-sm opacity-90">{t('helpDesk.subtitle')}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNewTicket(true)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors touch-target"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="p-4">
        {showNewTicket ? (
          <div className="glass-card rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{t('helpDesk.newTicket')}</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('helpDesk.ticketTitle')}
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  placeholder={t('helpDesk.enterTitle')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('helpDesk.category')}
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                >
                  <option value="General">{t('helpDesk.general')}</option>
                  <option value="Irrigation">{t('helpDesk.irrigation')}</option>
                  <option value="Pest Control">{t('helpDesk.pestControl')}</option>
                  <option value="Soil Health">{t('helpDesk.soilHealth')}</option>
                  <option value="Crop Management">{t('helpDesk.cropManagement')}</option>
                  <option value="Fertilization">{t('helpDesk.fertilization')}</option>
                  <option value="Equipment">{t('helpDesk.equipment')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('helpDesk.priority')}
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                >
                  <option value="LOW">{t('helpDesk.low')}</option>
                  <option value="MEDIUM">{t('helpDesk.medium')}</option>
                  <option value="HIGH">{t('helpDesk.high')}</option>
                  <option value="URGENT">{t('helpDesk.urgent')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('helpDesk.ticketDescription')}
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500"
                  placeholder={t('helpDesk.enterDescription')}
                  required
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors touch-target"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 touch-target"
                >
                  {loading ? t('helpDesk.creating') : t('helpDesk.createTicket')}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filters */}
            <div className="glass-card rounded-xl p-4 shadow-sm">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('helpDesk.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="ALL">{t('helpDesk.allStatus')}</option>
                  <option value="OPEN">{t('helpDesk.open')}</option>
                  <option value="IN_PROGRESS">{t('helpDesk.inProgress')}</option>
                  <option value="RESOLVED">{t('helpDesk.resolved')}</option>
                  <option value="CLOSED">{t('helpDesk.closed')}</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="ALL">{t('helpDesk.allPriority')}</option>
                  <option value="LOW">{t('helpDesk.low')}</option>
                  <option value="MEDIUM">{t('helpDesk.medium')}</option>
                  <option value="HIGH">{t('helpDesk.high')}</option>
                  <option value="URGENT">{t('helpDesk.urgent')}</option>
                </select>
              </div>
            </div>
            
            {/* Ticket List */}
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : 'glass-card hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-medium truncate ${
                        selectedTicket?.id === ticket.id ? 'text-white' : 'text-slate-800'
                      }`}>
                        {ticket.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-white/20' 
                          : getStatusColor(ticket.status)
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className={`text-sm truncate mb-3 ${
                      selectedTicket?.id === ticket.id ? 'text-white/90' : 'text-slate-600'
                    }`}>
                      {ticket.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-white/20' 
                          : getPriorityColor(ticket.priority)
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`text-xs ${
                        selectedTicket?.id === ticket.id ? 'text-white/70' : 'text-slate-500'
                      }`}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-xl p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">{t('helpDesk.noTickets')}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="glass-card rounded-xl p-6 shadow-sm h-full flex flex-col">
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{selectedTicket.title}</h2>
                      <div className="flex space-x-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {selectedTicket.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-500 hover:text-gray-700 touch-target"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-slate-600">{selectedTicket.description}</p>
                  
                  {selectedTicket.assignedTo && (
                    <div className="flex items-center mt-3 pt-3 border-t">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('helpDesk.assignedTo')}</p>
                        <p className="text-sm text-slate-600">{selectedTicket.assignedTo.name}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow overflow-y-auto mb-4 space-y-4 max-h-[400px]">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.sender.role === 'FARMER' 
                          ? 'bg-green-50 ml-8' 
                          : 'bg-blue-50 mr-8'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-800">
                          {message.sender.name}
                          {message.sender.role !== 'FARMER' && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {message.sender.role}
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700">{message.content}</p>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSendMessage} className="mt-auto border-t pt-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex-grow relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('helpDesk.typeMessage')}
                        rows={2}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg outline-none focus:border-green-500 resize-none"
                        required
                      ></textarea>
                      <div className="absolute right-2 bottom-2 flex space-x-1">
                        <button
                          type="button"
                          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center touch-target"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-12 text-center h-full flex items-center justify-center">
                <div>
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-slate-700 mb-2">{t('helpDesk.title')}</h3>
                  <p className="text-slate-500 max-w-md">
                    {t('helpDesk.description')}
                  </p>
                  <button
                    onClick={() => setShowNewTicket(true)}
                    className="mt-6 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors touch-target"
                  >
                    {t('helpDesk.newTicket')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Leaf className="w-6 h-6" />
            <span className="text-xs">{t('navigation.home')}</span>
          </Link>
          <Link href="/missions" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Target className="w-6 h-6" />
            <span className="text-xs">{t('navigation.missions')}</span>
          </Link>
          <Link href="/crop-tracking" className="flex flex-col items-center py-2 text-slate-400 touch-target">
            <Sprout className="w-6 h-6" />
            <span className="text-xs">{t('navigation.crops')}</span>
          </Link>
          <Link href="/help-desk" className="flex flex-col items-center py-2 text-green-600 touch-target">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">{t('navigation.helpDesk')}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}