import { LABELS, ROUTES } from '@/lib/constants';
import { QrCode, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-background border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4 group">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <QrCode className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">{LABELS.APP_NAME}</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Empowering businesses to build massive social proof through AI-driven customer reviews and seamless digital experiences.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors hover:text-primary-foreground">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors hover:text-primary-foreground">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors hover:text-primary-foreground">
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</Link></li>
                            <li><Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {LABELS.APP_NAME}. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Built with ❤️ using Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}
