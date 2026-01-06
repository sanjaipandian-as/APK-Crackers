import { useState, useEffect } from 'react';
import { FaTicketAlt, FaClock, FaCheckCircle, FaSpinner, FaTimesCircle, FaEye, FaChevronDown, FaChevronUp, FaInbox } from 'react-icons/fa';
import API from '../../../api';
import { SkeletonList } from '../../components/Common/SkeletonLoaders';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedTicket, setExpandedTicket] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('Fetching support tickets...');
            const response = await API.get('/support/my-tickets');
            console.log('Tickets response:', response.data);

            setTickets(response.data.tickets || []);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            console.error('Error response:', err.response);

            if (err.response?.status === 401) {
                setError('Please login to view your tickets');
            } else if (err.response?.status === 404) {
                setError('Support tickets endpoint not found. Please contact support.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to load tickets. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'pending': {
                label: 'Pending',
                icon: FaClock,
                color: 'orange',
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-700',
                borderColor: 'border-orange-500',
                description: 'Your ticket has been received and is waiting to be reviewed'
            },
            'in-progress': {
                label: 'In Progress',
                icon: FaSpinner,
                color: 'blue',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-700',
                borderColor: 'border-blue-500',
                description: 'Our team is actively working on your request'
            },
            'resolved': {
                label: 'Resolved',
                icon: FaCheckCircle,
                color: 'green',
                bgColor: 'bg-green-100',
                textColor: 'text-green-700',
                borderColor: 'border-green-500',
                description: 'Your issue has been resolved'
            },
            'closed': {
                label: 'Closed',
                icon: FaTimesCircle,
                color: 'gray',
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-700',
                borderColor: 'border-gray-500',
                description: 'This ticket has been closed'
            }
        };
        return configs[status] || configs['pending'];
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'general': 'General Inquiry',
            'order': 'Order Issue',
            'product': 'Product Question',
            'payment': 'Payment Problem',
            'delivery': 'Delivery Issue',
            'return': 'Return/Refund',
            'technical': 'Technical Support',
            'other': 'Other'
        };
        return labels[category] || category;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    const filteredTickets = filter === 'all'
        ? tickets
        : tickets.filter(ticket => ticket.status === filter);

    const toggleTicketExpansion = (ticketId) => {
        setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
    };

    if (loading) {
        return (
            <div className="space-y-4 sm:space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-gray-100 animate-pulse">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl flex-shrink-0"></div>
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-6 sm:h-8 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-64"></div>
                    </div>
                </div>

                {/* Filter Tabs Skeleton */}
                <div className="flex gap-2 overflow-x-auto pb-2 animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-9 bg-gray-200 rounded-lg w-24 flex-shrink-0"></div>
                    ))}
                </div>

                {/* Tickets List Skeleton */}
                <SkeletonList items={4} />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-gray-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaTicketAlt className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Support Tickets</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Track and manage your support requests</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
                        <button
                            onClick={fetchTickets}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all text-sm active:scale-95"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="-mx-4 sm:mx-0">
                <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-2 sm:pb-0 scrollbar-hide snap-x snap-mandatory">
                    {[
                        { value: 'all', label: 'All', fullLabel: 'All Tickets', count: tickets.length },
                        { value: 'pending', label: 'Pending', fullLabel: 'Pending', count: tickets.filter(t => t.status === 'pending').length },
                        { value: 'in-progress', label: 'Progress', fullLabel: 'In Progress', count: tickets.filter(t => t.status === 'in-progress').length },
                        { value: 'resolved', label: 'Resolved', fullLabel: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
                        { value: 'closed', label: 'Closed', fullLabel: 'Closed', count: tickets.filter(t => t.status === 'closed').length }
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap flex-shrink-0 snap-start ${filter === tab.value
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                                }`}
                        >
                            <span className="hidden sm:inline">{tab.fullLabel}</span>
                            <span className="sm:hidden">{tab.label}</span>
                            <span className="ml-1">({tab.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tickets List */}
            {filteredTickets.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300">
                    <FaInbox className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 px-4">
                        {filter === 'all' ? 'No support tickets yet' : `No ${filter} tickets`}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                        {filter === 'all'
                            ? 'You haven\'t created any support tickets yet'
                            : `You don't have any ${filter} tickets at the moment`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {filteredTickets.map((ticket) => {
                        const statusConfig = getStatusConfig(ticket.status);
                        const StatusIcon = statusConfig.icon;
                        const isExpanded = expandedTicket === ticket._id;

                        return (
                            <div
                                key={ticket._id}
                                className={`bg-white border-2 ${statusConfig.borderColor} rounded-lg sm:rounded-xl overflow-hidden transition-all hover:shadow-lg`}
                            >
                                {/* Ticket Header */}
                                <div className="p-3 sm:p-4 md:p-6">
                                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Status Badge */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm`}>
                                                    <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${ticket.status === 'in-progress' ? 'animate-spin' : ''}`} />
                                                    <span className="hidden xs:inline">{statusConfig.label}</span>
                                                </span>
                                                <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 text-gray-700 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                                                    {getCategoryLabel(ticket.category)}
                                                </span>
                                            </div>

                                            {/* Ticket Title */}
                                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                {ticket.subject}
                                            </h3>

                                            {/* Ticket Meta */}
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <FaClock className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{formatDate(ticket.createdAt)}</span>
                                                </span>
                                                <span className="font-mono text-[10px] sm:text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                    #{ticket._id.slice(-8)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Expand Button */}
                                        <button
                                            onClick={() => toggleTicketExpansion(ticket._id)}
                                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0 active:scale-95"
                                        >
                                            {isExpanded ? (
                                                <FaChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                            ) : (
                                                <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Status Description */}
                                    <div className={`mt-3 sm:mt-4 p-2 sm:p-3 ${statusConfig.bgColor} rounded-lg`}>
                                        <p className={`text-xs sm:text-sm ${statusConfig.textColor} font-medium`}>
                                            {statusConfig.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                                        {/* Your Message */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                <FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                                                Your Message
                                            </h4>
                                            <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
                                                <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{ticket.message}</p>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Contact Information</h4>
                                            <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <span className="font-semibold text-gray-700 text-xs sm:text-sm">Name:</span>
                                                        <span className="text-gray-900 text-sm sm:text-base break-words">{ticket.name}</span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <span className="font-semibold text-gray-700 text-xs sm:text-sm">Email:</span>
                                                        <span className="text-gray-900 text-sm sm:text-base break-all">{ticket.email}</span>
                                                    </div>
                                                    {ticket.phone && (
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                            <span className="font-semibold text-gray-700 text-xs sm:text-sm">Phone:</span>
                                                            <span className="text-gray-900 text-sm sm:text-base">{ticket.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Response */}
                                        {ticket.adminResponse && (
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                    <FaCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                                    Support Team Response
                                                </h4>
                                                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 shadow-sm">
                                                    <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{ticket.adminResponse}</p>
                                                    {ticket.respondedAt && (
                                                        <p className="text-xs sm:text-sm text-green-600 mt-2 sm:mt-3 font-medium">
                                                            Responded {formatDate(ticket.respondedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Timeline */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Timeline</h4>
                                            <div className="space-y-3 sm:space-y-4 relative">
                                                {/* Timeline connector line */}
                                                {ticket.respondedAt && (
                                                    <div className="absolute left-3.5 sm:left-4 top-8 sm:top-10 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 to-green-300"></div>
                                                )}

                                                <div className="flex items-start gap-2 sm:gap-3 relative">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-orange-100">
                                                        <FaTicketAlt className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Ticket Created</p>
                                                        <p className="text-xs sm:text-sm text-gray-600 break-words">{new Date(ticket.createdAt).toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                                {ticket.respondedAt && (
                                                    <div className="flex items-start gap-2 sm:gap-3 relative">
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-green-100">
                                                            <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Response Received</p>
                                                            <p className="text-xs sm:text-sm text-gray-600 break-words">{new Date(ticket.respondedAt).toLocaleString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Help Text */}
            {tickets.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-blue-700">
                        <strong>Need more help?</strong> Our support team typically responds within 24 hours.
                        You can create a new ticket from the Support page.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Tickets;
