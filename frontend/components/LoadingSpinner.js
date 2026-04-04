'use client';

/**
 * LoadingSpinner Component
 * 
 * A versatile loading indicator with multiple variants:
 * - 'spinner': Standard rotating spinner
 * - 'logo': Clean, professional brand loading
 * - 'dots': Bouncing dots animation
 * - 'pulse': Pulsing circle
 */

export default function LoadingSpinner({
    variant = 'spinner',
    size = 'md',
    message = 'Loading...',
    fullScreen = false,
    className = ''
}) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const containerClasses = fullScreen
        ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-50'
        : 'flex flex-col items-center justify-center py-8';

    // Spinner Variant
    const SpinnerIcon = () => (
        <div className={`${sizeClasses[size]} ${className}`}>
            <div className="w-full h-full border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    // Logo Variant - Clean, professional brand loading
    const LogoIcon = () => (
        <>
            <style jsx>{`
                @keyframes smoothFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes gentlePulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.88;
                    }
                }
            `}</style>

            <div className="flex flex-col items-center">
                <div
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                    style={{ animation: 'smoothFadeIn 0.5s ease-out' }}
                >
                    <img
                        src="/image/a2zstaff logo.png"
                        alt="A2Z Staff"
                        className="w-20 h-20 object-contain"
                        style={{ animation: 'gentlePulse 2.5s ease-in-out infinite' }}
                    />
                </div>
            </div>
        </>
    );

    // Dots Variant
    const DotsIcon = () => (
        <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
    );

    // Pulse Variant
    const PulseIcon = () => (
        <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse ${className}`}></div>
    );

    const renderIcon = () => {
        switch (variant) {
            case 'logo':
                return <LogoIcon />;
            case 'dots':
                return <DotsIcon />;
            case 'pulse':
                return <PulseIcon />;
            case 'spinner':
            default:
                return <SpinnerIcon />;
        }
    };

    return (
        <div className={containerClasses}>
            {renderIcon()}
            {message && (
                <p className="mt-4 text-secondary-600 text-sm font-medium">
                    {message}
                </p>
            )}
        </div>
    );
}
