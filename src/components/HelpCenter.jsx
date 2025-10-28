import React, { useState } from 'react';

const faqs = [
  {
    question: 'How do I book a ride?',
    answer: 'To book a ride, go to the Book Your Ride section, enter your pickup and drop locations, select date and passengers, then click Search Ride.',
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking from your profile page under "My Rides" section before the scheduled ride time.',
  },
  {
    question: 'How do I pay for the ride?',
    answer: 'You can pay via credit/debit cards, UPI, or cash after the ride completes.',
  },
  {
    question: 'What if I forgot my login password?',
    answer: 'Use the "Forgot Password" option on the login page to reset your password via email.',
  },
  {
    question: 'Is there a customer support number?',
    answer: 'Yes, you can reach customer support 24/7 at +1-800-123-4567 or email support@ridenow.com.',
  },
];

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="max-w-7xl mx-auto  sm:p-6 py-6 px-2">
      <h1 className="text-4xl font-bold text-blue-500 mb-8 text-center">Help Center</h1>


      {/* FAQ Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(({ question, answer }, idx) => (
            <div
              key={idx}
              className="bg-blue-50 border border-blue-200 rounded-md shadow-sm transition-shadow"
            >
              <button
                className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                onClick={() => toggleFAQ(idx)}
              >
                <h3 className="text-lg font-semibold text-blue-700">{question}</h3>
                <span className="text-blue-700 text-xl">
                  {openIndex === idx ? '−' : '+'}
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4 text-gray-700">
                  <p>{answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No FAQs matched your search.
          </p>
        )}
      </div>
    </section>
  );
};

export default HelpCenter;
