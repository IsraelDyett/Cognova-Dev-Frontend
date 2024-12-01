import { FileText, Bot, Share2 } from "lucide-react";
import Image from "next/image";

export default function StepsFlowSection() {
	return (
		<section>
			<div className="text-center mb-16">
				<h2 className="text-base font-semibold leading-7 text-primary pb-4">
					How It Works
				</h2>
				<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Transform Your Business Support in 3 Steps
				</p>
			</div>
			<div className="grid lg:grid-cols-2 gap-12 items-center">
				<div className="space-y-16">
					<div className="flex gap-6">
						<div className="flex-shrink-0">
							<div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
								<FileText className="w-6 h-6 text-primary" />
							</div>
						</div>
						<div>
							<h4 className="text-xl font-bold mb-2">1. Upload Business Knowledge</h4>
							<p className="text-gray-600 text-base">
								Upload your business documents (PDFs, website URLs, product
								catalogs) to our secure platform. Our AI will learn everything about
								your products, services, and business processes.
							</p>
						</div>
					</div>

					<div className="flex gap-6">
						<div className="flex-shrink-0">
							<div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
								<Bot className="w-6 h-6 text-primary" />
							</div>
						</div>
						<div>
							<h4 className="text-xl font-bold mb-2">2. Connect Your Channels</h4>
							<p className="text-gray-600 text-base">
								Connect your WhatsApp Business account and embed our smart chatbot
								on your website. Your AI assistant is now ready to handle customer
								inquiries 24/7 across all channels.
							</p>
						</div>
					</div>

					<div className="flex gap-6">
						<div className="flex-shrink-0">
							<div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
								<Share2 className="w-6 h-6 text-primary" />
							</div>
						</div>
						<div>
							<h4 className="text-xl font-bold mb-2">3. Launch & Monitor</h4>
							<p className="text-gray-600 text-base">
								Access your dashboard to monitor conversations, analyze performance,
								and fine-tune your AI. Watch as your AI handles product inquiries,
								support questions, and customer engagement automatically.
							</p>
						</div>
					</div>
				</div>

				<div className="grid gap-4">
					<div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-0.5">
						<Image
							src="/images/demos/dashboard-preview.png"
							alt="AI Dashboard Analytics"
							className="h-full w-full"
							width={1910}
							height={845}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-0.5">
							<Image
								src="/images/demos/whatsapp-integration.png"
								alt="WhatsApp Integration"
								className="rounded-xl h-36"
								width={1351}
								height={760}
							/>
						</div>
						<div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-0.5">
							<Image
								src="/images/demos/chat-widget-demo.png"
								alt="Website Chat Widget"
								className="rounded-xl object-fill h-36"
								width={678}
								height={530}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
