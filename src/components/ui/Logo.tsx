import { QrCode } from 'lucide-react';
import { LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

export function Logo({ className, iconClassName, textClassName }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <div className="bg-[#111111] dark:bg-white p-2 rounded-[1.2rem] shadow-sm flex items-center justify-center">
                <QrCode className={cn("h-6 w-6 text-white dark:text-black", iconClassName)} />
            </div>
            <span className={cn("text-2xl font-black tracking-tight text-[#111111] dark:text-white", textClassName)}>
                {LABELS.APP_NAME}
            </span>
        </div>
    );
}
