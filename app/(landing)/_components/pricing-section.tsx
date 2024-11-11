"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, MessageSquare, Database, Bot, Smartphone, LineChart } from "lucide-react";
import React, { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    messageLimit: "50",
    dataLimit: "1GB",
    features: [
      "1 WhatsApp Business Integration",
      "Basic AI Chatbot",
      "PDF & Website Data Import",
      "Basic Analytics Dashboard",
      "Email Support",
      "Website Chat Widget",
    ],
  },
  {
    name: "Business",
    monthlyPrice: 5,
    yearlyPrice: 59,
    messageLimit: "1000",
    dataLimit: "10GB",
    features: [
      "3 WhatsApp Business Integrations",
      "Advanced AI Chatbot",
      "PDF, Website & API Data Import",
      "Advanced Analytics & Reporting",
      "Priority Support",
      "Website Chat Widget + Mobile SDK",
      "Multi-language Support",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 19,
    yearlyPrice: 219,
    messageLimit: "Unlimited",
    dataLimit: "100GB+",
    features: [
      "Unlimited WhatsApp Integrations",
      "Custom & Latest AI Chatbot",
      "Unlimited Data Sources",
      "Real-time Analytics & API Access",
      "24/7 Dedicated Support",
      "Website Chat Widget + Mobile SDK",
      "Multi-language Support",
    ],
  },
];

export default function PricingSection() {
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  return (
    <section id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Choose Your AI Assistant Plan</h2>
          <p className="text-xl text-gray-600 mb-8">
            Scale your customer support with AI-powered WhatsApp automation
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${!yearlyBilling ? "font-bold" : ""}`}>Monthly</span>
            <Switch checked={yearlyBilling} onCheckedChange={setYearlyBilling} />
            <span className={`text-lg ${yearlyBilling ? "font-bold" : ""}`}>Yearly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border ${
                  plan.recommended ? "border-blue-500" : "border-gray-200"
                } bg-white shadow-md`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-0 right-0">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold">
                      ${yearlyBilling ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500 ml-2">/{yearlyBilling ? "year" : "month"}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-700">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      <span>{plan.messageLimit} messages/month</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Database className="w-5 h-5 mr-2" />
                      <span>{plan.dataLimit} storage</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mb-8"
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => setSelectedPlan(index)}
                  >
                    Start {plan.name} Plan
                  </Button>

                  <div className="space-y-4">
                    <p className="font-semibold">Features included:</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
