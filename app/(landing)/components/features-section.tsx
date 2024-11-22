import React from "react";
import { CloudUpload, Bot, Database, MessageSquare, LineChart, ShoppingCart } from "lucide-react";

const features = [
  {
    name: "Real-time Inventory & Business Info",
    description:
      "Add and manage your products, pricing, and business contact information. AI automatically handles inventory queries and provides up-to-date product availability to customers.",
    href: "#",
    icon: ShoppingCart,
  },
  {
    name: "Intelligent Data Processing",
    description:
      "Upload PDFs, documents, and website content to train your AI. Our system automatically processes and indexes your business data to create a knowledge base for accurate responses.",
    href: "#",
    icon: CloudUpload,
  },
  {
    name: "WhatsApp Business Integration",
    description:
      "Seamlessly connect your WhatsApp Business account and let our AI handle customer inquiries 24/7. Provide instant responses about products, services, and business information.",
    href: "#",
    icon: MessageSquare,
  },
  {
    name: "Multi-Channel Support",
    description:
      "Embed our AI chatbot on your website or use our customizable chat widget. Provide consistent support across WhatsApp and web platforms while maintaining conversation history.",
    href: "#",
    icon: Bot,
  },
  {
    name: "Advanced Analytics",
    description:
      "Track customer interactions, monitor response times, and gain insights into frequently asked questions. Make data-driven decisions to improve your customer service.",
    href: "#",
    icon: LineChart,
  },
  {
    name: "Knowledge Base Management",
    description:
      "Easily update and manage your business information through our intuitive dashboard. Add new products, services, or FAQs that your AI assistant can instantly learn.",
    href: "#",
    icon: Database,
  },
];

export default function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32" id="features">
      <div className="container text-center">
        <h2 className="text-base font-semibold leading-7 text-primary pb-4">Powerful Features</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Transform Your Customer Support with AI-Powered Intelligence
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Leverage the power of artificial intelligence to provide instant, accurate responses to
          your customers. Upload your business data, connect WhatsApp Business, and let our AI
          handle the rest.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                {feature.name}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">{feature.description}</p>
                <p className="mt-6">
                  <a href={feature.href} className="text-sm font-semibold leading-6 text-primary">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
