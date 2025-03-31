import { Navbar } from "@/components/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Faq() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Navbar />

      
      <h1 className="mt-20 text-4xl max-md:text-2xl font-bold text-center text-primary">Frequently Asked Questions</h1>
      <p className="text-md text-gray-600 text-center mt-2">
        Find answers to common questions about our products, shipping, and policies.
      </p>

      <div className="mt-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept major credit/debit cards, UPI, Net Banking, and Wallet payments. All transactions are securely processed.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>How long does delivery take?</AccordionTrigger>
            <AccordionContent>
              Standard delivery takes **5-7 business days**. Express shipping options are also available at checkout.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>Can I cancel my order after placing it?</AccordionTrigger>
            <AccordionContent>
              Yes, orders can be canceled within **7 days of purchase**, provided they haven&apos;t been shipped. Check our 
              <a href="/cancellation-and-refund" className="text-green-600 underline"> Cancellation & Refund Policy</a>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger>What if I receive a damaged or wrong product?</AccordionTrigger>
            <AccordionContent>
              If you receive a defective or incorrect product, contact our **Customer Support** within 7 days. We will process a replacement or refund.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger>Are your products natural?</AccordionTrigger>
            <AccordionContent>
              Yes! All our products are **100% natural, chemical-free, and sourced from trusted farms**.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q6">
            <AccordionTrigger>How can I track my order?</AccordionTrigger>
            <AccordionContent>
              Once shipped, you will receive an email with a **tracking link** to monitor your order’s status in real-time.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q7">
            <AccordionTrigger>Do you offer international shipping?</AccordionTrigger>
            <AccordionContent>
              Currently, we ship only within **India**. However, we are working on expanding our delivery network soon!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q8">
            <AccordionTrigger>How do I contact customer support?</AccordionTrigger>
            <AccordionContent>
              You can reach us via email at **support@grabgardenn.com** or call us at **+91-XXXXXXXXXX** (9 AM - 6 PM IST).
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
