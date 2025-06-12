import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="px-10 py-10">
      <section id="privacy" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p>
          At SM Clothing, we respect your privacy and are committed to
          protecting your personal information. We collect data only to process
          orders and improve your shopping experience. We never share your
          personal details with third parties for marketing purposes without
          your consent.
        </p>
      </section>

      <section id="terms" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
        <p>
          By using our website and placing an order, you agree to comply with
          our terms and conditions. Orders are subject to acceptance and
          availability. We reserve the right to refuse or cancel an order for
          reasons including product availability, errors in pricing, or
          infringement of intellectual property.
        </p>
      </section>

      <section id="refund" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
        <p>
          We offer a 30-day refund policy from the date of delivery. To be
          eligible, items must be unused, in original packaging, and accompanied
          by proof of purchase. Refunds will be processed within 14 days of
          receiving the returned items.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
