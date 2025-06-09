import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Headphones
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const HelpSupportPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const supportCategories = [
    {
      id: 'booking',
      title: 'Booking Issues',
      examples: ['Cannot complete booking', 'Vendor not responding', 'Event details modification']
    },
    {
      id: 'payment',
      title: 'Payment Issues',
      examples: ['Payment failed', 'Refund request', 'Wrong amount charged']
    },
    {
      id: 'service',
      title: 'Service Not Provided',
      examples: ['Vendor no-show', 'Poor service quality', 'Incomplete service delivery']
    },
    {
      id: 'general',
      title: 'General Support',
      examples: ['Account access', 'Technical issues', 'Feature requests']
    }
  ];

  const faqs = [
    {
      category: 'booking',
      question: 'How do I cancel or modify my booking?',
      answer: 'You can cancel or modify your booking up to 24 hours before the event date. Go to "My Bookings" in your account, select the booking, and choose "Cancel" or "Modify". Cancellation charges may apply based on our policy.'
    },
    {
      category: 'booking',
      question: 'What if a vendor is not responding to my booking request?',
      answer: 'If a vendor doesn\'t respond within 24 hours, we\'ll automatically suggest alternative vendors. You can also contact our support team for immediate assistance in finding replacement vendors.'
    },
    {
      category: 'payment',
      question: 'My payment failed but money was deducted. What should I do?',
      answer: 'If payment fails but amount is deducted, it\'s usually a temporary authorization that will be reversed within 3-5 business days. If not reversed, please contact us with your transaction ID for immediate refund processing.'
    },
    {
      category: 'payment',
      question: 'How do I get a refund?',
      answer: 'Refunds are processed based on our cancellation policy. For cancellations made 24+ hours before event: 90% refund. For emergency cancellations: case-by-case review. Refunds are processed within 5-7 business days.'
    },
    {
      category: 'service',
      question: 'What if the vendor doesn\'t show up for my event?',
      answer: 'This is a serious issue. Contact our emergency support immediately at +91-9876543210. We\'ll arrange replacement services if possible and ensure full refund plus compensation for the inconvenience.'
    },
    {
      category: 'service',
      question: 'The service quality was poor. How do I report this?',
      answer: 'Please submit a detailed complaint with photos/videos if available. We take service quality seriously and will investigate, potentially offering partial refunds and taking action against the vendor.'
    },
    {
      category: 'general',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email. If you don\'t receive the email, check your spam folder or contact support.'
    },
    {
      category: 'general',
      question: 'Can I change my account information?',
      answer: 'Yes, go to "Profile Settings" in your account to update your name, phone number, address, and other details. Email changes require verification for security.'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support form submitted:', formData);
    alert('Thank you! Your support request has been submitted. We\'ll get back to you within 2-4 hours.');
  };

  const filteredFaqs = faqs.filter(faq => 
    (selectedCategory === '' || faq.category === selectedCategory) &&
    (searchQuery === '' || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
    <Navbar />
        <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Help & Support</h1>
            <p className="text-xl text-gray-600">We're here to help you 24/7</p>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Direct Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us Directly</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email Support</p>
                <p className="font-medium">support@eventwala.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">24/7 Phone Support</p>
                <p className="font-medium">+91-9876543210</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {supportCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            {/* FAQ List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-3 text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Support Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Headphones className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Submit Support Request</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {supportCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your issue..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200"
              >
                Submit Support Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default HelpSupportPage;