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
		answer: `${siteConfig.applicationName} is an AI-powered sales assistant platform that helps businesses automate customer interactions through Instagram DMs and web-based chat.`,
	},
	{
		question: `How does ${siteConfig.applicationName} work?`,
		answer: `${siteConfig.applicationName} works in three simple steps:<br/>1) Create your AI sales agent and customize its behavior,<br/>2) Get a unique chat link to share with your customers,<br/>3) Let your AI agent handle customer inquiries and sales conversations 24/7 through Instagram and web chat.`,
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
		question: `How does Instagram integration work with ${siteConfig.applicationName}?`,
		answer: `Our platform seamlessly connects with your Instagram business account. Once connected, your AI agent can manage all conversations and handle customer inquiries directly through Instagram DMs, providing instant responses about your products and services.`,
	},
	{
		question: `Can I embed the chat widget on my website?`,
		answer: `Yes! You can easily embed your AI chat widget on any website using our simple embed code. The chat widget maintains your brand's look and feel while providing 24/7 automated customer support.`,
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
