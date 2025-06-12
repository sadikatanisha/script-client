import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "How long does shipping take?",
    answer:
      "We ship all orders within 1–2 business days. Once your order is on its way, delivery typically takes 3–5 business days anywhere in Bangladesh. You’ll receive a tracking link via email as soon as your order ships.",
  },
  {
    question: "Can I return or exchange my item?",
    answer:
      "Yes! If you’re not completely satisfied, you can request a return or exchange within 7 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Check our Returns page for full details.",
  },
  {
    question: "Are these pieces truly one-of-a-kind?",
    answer:
      "Absolutely. Every garment is handcrafted in limited batches—once it's gone, it’s gone. Our designs won’t be reproduced, so you can rock a look that nobody else has.",
  },
  {
    question: "Can I customize my clothing now?",
    answer:
      "Customization features are coming soon! Stay tuned: you’ll soon be able to pick colors, add text, and tweak details on select styles. For now, check out our Ready-to-Wear collection.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can email us at support@smclothing.com or use the chat widget in the bottom right corner of the site. We aim to respond within 24 hours, Monday–Saturday.",
  },
];

const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="px-4 sm:px-10 py-10 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => toggleIndex(index)}
              >
                <span className="text-lg font-medium text-gray-800">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 py-3 bg-white text-gray-700">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
