'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does the AI help write reviews?",
        answer: "Our AI uses Google's Gemini Pro to help customers articulate their feedback. When a customer scans your QR code and provides a few initial thoughts or selects categories (like 'Great Food' or 'Fast Service'), the AI drafts a polished, natural-sounding review for them to copy and paste."
    },
    {
        question: "What review platforms are supported?",
        answer: "You can redirect customers to ANY platform with a URL. Most businesses use it for Google Maps, but it works equally well for Yelp, TripAdvisor, Facebook, or your own website's testimonial page."
    },
    {
        question: "Do I need to install an app?",
        answer: "No. ReviewQR is a web-based experience. Your customers just scan the QR code and everything happens in their phone's web browser. For you as a business owner, you also manage everything through our web dashboard."
    },
    {
        question: "Can I customize the QR code?",
        answer: "Yes! In your dashboard, you can customize your profile image, business name, and the specific review links. We generate a high-quality poster including your unique QR code that you can print."
    },
    {
        question: "Is there a limit on how many reviews can be generated?",
        answer: "The AI generation depends on your plan, but we offer generous limits to ensure your business can grow its social proof without worrying about technical restrictions. You can generate a new AI review every 2 minutes, as there is a short cooldown period between generations."
    }
];

export function FAQ() {
    return (
        <section id="faq" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 px-4 mb-4 bg-background rounded-2xl border">
                                <AccordionTrigger className="text-left py-6 hover:no-underline font-semibold text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
