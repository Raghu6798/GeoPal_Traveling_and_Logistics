import { ChevronDown } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is the Travel Agent AI?",
    answer: "Travel Agent AI is an intelligent travel planning assistant that helps you create personalized travel itineraries, find the best deals, and get real-time recommendations based on your preferences. It combines the power of artificial intelligence with expert travel knowledge to make your travel planning seamless and enjoyable."
  },
  {
    question: "How does the pricing work?",
    answer: "We offer two simple plans: Free and Pro. The Free plan gives you access to basic travel planning features and limited AI interactions. The Pro plan ($29/month) includes unlimited AI interactions, advanced itinerary planning, real-time flight and hotel deals, and priority support. You can upgrade or downgrade your plan at any time."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, absolutely! You can cancel your Pro subscription at any time. When you cancel, you'll continue to have access to Pro features until the end of your current billing period. After that, your account will automatically switch to the Free plan."
  },
  {
    question: "How accurate are the travel recommendations?",
    answer: "Our AI travel agent uses real-time data and advanced algorithms to provide accurate and up-to-date recommendations. It considers factors like current prices, availability, weather conditions, and local events. However, we recommend double-checking specific details with official sources before making final bookings."
  },
  {
    question: "What kind of support do you offer?",
    answer: "Free plan users have access to our community forum and basic email support. Pro users get priority email support, live chat assistance during business hours, and dedicated account management for enterprise customers. We're committed to helping you have the best travel experience possible."
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we take security very seriously. All payment processing is handled through secure, encrypted connections. We use industry-standard security measures and comply with all relevant data protection regulations. We never store your full credit card details on our servers."
  },
  {
    question: "Can I use the service for business travel?",
    answer: "Yes! Our Pro plan is perfect for business travelers. It includes features like expense tracking, corporate booking options, and the ability to manage multiple travelers. For larger organizations, we offer custom enterprise solutions with additional features and dedicated support."
  },
  {
    question: "How does the AI learn my preferences?",
    answer: "Our AI learns from your interactions, saved preferences, and travel history. The more you use the service, the better it understands your travel style, budget, and preferences. You can also explicitly set preferences in your profile to help the AI provide more personalized recommendations."
  }
]

export function FAQSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-semibold leading-7 text-gray-900">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-7 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </dl>
        </div>
      </div>
    </div>
  )
} 