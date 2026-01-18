import { UserPlus, QrCode, TrendingUp } from 'lucide-react';

const steps = [
    {
        title: 'Setup Your Profile',
        description: 'Create your account and add your business details. Link your Google Maps or other review URLs.',
        icon: UserPlus,
    },
    {
        title: 'Print Your QR Code',
        description: 'Download your unique AI-powered QR code poster. Place it where customers can easily scan it.',
        icon: QrCode,
    },
    {
        title: 'Watch Reviews Grow',
        description: 'Customers scan, AI assists them in writing a great review, and they are redirected to post it instantly.',
        icon: TrendingUp,
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">How it Works</h2>
                    <p className="text-muted-foreground text-lg">Three simple steps to supercharge your online presence</p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 -z-10" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 relative group-hover:border-primary/30 transition-colors">
                                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </span>
                                    <step.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
