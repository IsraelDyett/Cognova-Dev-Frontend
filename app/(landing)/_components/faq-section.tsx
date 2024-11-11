import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site";

const faqs = [
  {
    question: `What is ${siteConfig.applicationName}`,
    answer: `${siteConfig.applicationName} is an advanced AI-powered customer support platform that uses natural language processing and machine learning to provide 24/7 automated support across multiple channels, including WhatsApp and web chat.`,
  },
  {
    question: `How does  ${siteConfig.applicationName} works?`,
    answer: `${siteConfig.applicationName} works in three simple steps: <br/>1) You upload your data to our secure platform,<br/>2) Our AI processes and analyzes the data, and<br/>3) The system provides automated responses to customer queries based on the analyzed data. The AI continuously learns and improves from each interaction.`,
  },
  {
    question: `Can  ${siteConfig.applicationName} integrate with my existing systems?`,
    answer: `Yes,  ${siteConfig.applicationName} is designed to seamlessly integrate with various existing systems. We support multiple file formats and data types to ensure smooth integration with your current setup. For specific integration questions, please contact our support team.`,
  },
  {
    question: `Is my data secure with  ${siteConfig.applicationName}?`,
    answer: `Absolutely. We take data security very seriously. All data is encrypted both in transit and at rest. We comply with industry-standard security protocols and regulations to ensure your data remains safe and confidential.`,
  },
  {
    question: `How does pricing work for  ${siteConfig.applicationName}?`,
    answer: `We offer flexible pricing plans to suit businesses of all sizes. Our plans are based on the volume of interactions and the features you need. You can start with our free trial to experience the benefits of  ${siteConfig.applicationName}. For detailed pricing information, please visit our pricing page or contact our sales team.`,
  },
  {
    question: `Can I customize the AI's responses?`,
    answer: `Yes,  ${siteConfig.applicationName} is highly customizable. You can train the AI with your specific product information, brand voice, and customer service protocols. This ensures that the AI's responses align with your brand and meet your specific needs.`,
  },
  {
    question: `What languages does  ${siteConfig.applicationName} support?`,
    answer: ` ${siteConfig.applicationName} supports multiple languages, allowing you to provide support to a global customer base. The specific languages available depend on your chosen plan. Please check our features page or contact our sales team for the most up-to-date list of supported languages.`,
  },
];

export default function FAQSection() {
  return (
    <section id="faq">
      <div className="container px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-base font-semibold leading-7 text-primary pb-4">FAQ</h2>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
