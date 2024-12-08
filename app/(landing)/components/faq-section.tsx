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
		answer: `${siteConfig.applicationName} is an AI-powered sales assistant platform that helps businesses automate customer interactions across social media channels like WhatsApp and Instagram.`,
	},
	{
		question: `How does ${siteConfig.applicationName} work?`,
		answer: `${siteConfig.applicationName} works in three simple steps:<br/>1) Create your AI sales agent and customize its behavior,<br/>2) Get a unique chat link to share with your customers,<br/>3) Let your AI agent handle customer inquiries and sales conversations 24/7 across WhatsApp and Instagram.`,
	},
	{
		question: `How can I share my AI agent with customers?`,
		answer: `Once you create your AI sales agent, you'll get a unique chat link that you can share directly with customers or add to your social media profiles. When customers click the link, they can start chatting with your AI agent instantly.`,
	},
	{
		question: `Is my data secure with ${siteConfig.applicationName}?`,
		answer: `Absolutely. We take data security very seriously. All conversations are encrypted, and we follow strict privacy protocols to ensure your business and customer data remains confidential.`,
	},
	{
		question: `How does pricing work for ${siteConfig.applicationName}?`,
		answer: `We offer flexible pricing plans based on your needs. You can start with our free trial to experience the benefits of having an AI sales agent. Our plans scale with your business, offering more features and conversation capacity as you grow.`,
	},
	{
		question: `Can I customize my AI agent's responses?`,
		answer: `Yes, ${siteConfig.applicationName} allows you to fully customize your AI agent's personality, tone, and responses. You can train it to match your brand voice and handle specific types of customer interactions.`,
	},
	{
		question: `How does WhatsApp integration work with ${siteConfig.applicationName}?`,
		answer: `Our platform automatically verifies your WhatsApp Business phone number and handles the integration process. Once verified, your AI agent can manage all conversations, share business contacts, and handle customer inquiries directly through WhatsApp. This means your customers can chat with your AI agent using your official business WhatsApp number.`,
	},
	{
		question: `Can my AI agent share business contacts during conversations?`,
		answer: `Yes! When customers request contact information or during relevant conversations, your AI agent can automatically share verified business contact details through WhatsApp. This includes your business phone number, location, and other important contact information, making it easier for customers to reach you directly when needed.`,
	},
	{
		question: `How does phone number verification work?`,
		answer: `The process is simple and secure. You provide your business phone number, and our system automatically handles the WhatsApp Business verification process. Once verified, your AI agent can start managing conversations using your official business number, maintaining a professional and trustworthy presence.`,
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
				<Accordion type="multiple" className="w-full max-w-4xl mx-auto">
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger className="text-left">
								{faq.question}
							</AccordionTrigger>
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
