import { QrCode, Sparkles, Zap, Smartphone, Shield, BarChart3 } from 'lucide-react';

const features = [
    {
        title: 'AI-Powered Assistance',
        description: 'Powered by Google Gemini to help customers draft professional, high-quality reviews in seconds based on their feedback.',
        icon: Sparkles,
    },
    {
        title: 'Custom Branded QR',
        description: 'Generate high-quality QR code posters that match your brand. Print them and put them at checkout or on tables.',
        icon: QrCode,
    },
    {
        title: 'Zero Latency Redirects',
        description: 'Automatically send customers directly to your Google Maps, Yelp, or Facebook review page after review generation.',
        icon: Zap,
    },
    {
        title: 'Mobile First Design',
        description: 'A seamless, app-like experience for your customers on any mobile device without needing to download anything.',
        icon: Smartphone,
    },
    {
        title: 'Smart Category Selection',
        description: 'Let customers choose specific parts of their experience (service, food, ambiance) for more targeted AI reviews.',
        icon: BarChart3,
    },
    {
        title: 'Privacy Focused',
        description: 'We prioritize security and privacy. No complex registration for customers, making them more likely to leave a review.',
        icon: Shield,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to grow your reviews</h2>
                    <p className="text-xl text-muted-foreground">
                        ReviewQR simplifies the feedback loop, making it effortless for your happy customers to share their experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
