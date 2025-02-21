const LoadingScreen = () => {
    return (
        <div className="h-screen  flex flex-col items-center justify-center bg-orange-50 space-y-8 overflow-hidden">
            {/* Floating Food Icons */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute text-3xl animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            fontSize: `${Math.random() * 20 + 20}px`,
                            opacity: Math.random() * 0.3 + 0.2
                        }}
                    >
                        {['🍕', '🍔', '🍟', '🌮', '🥑', '🥩', '🍣', '🥞', '🍗', '🥐', '🧀', '🥘'][i % 12]}
                    </div>
                ))}
            </div>

            {/* Animated Chef's Pan */}
            <div className="relative z-10">
                <div className="w-48 h-48 bg-orange-100 rounded-full shadow-lg flex items-center justify-center">
                    {/* Sizzling Pan */}
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-orange-500 rounded-full animate-pulse shadow-lg">
                                {/* Sizzle Animation */}
                                <div className="absolute inset-0 flex items-center justify-center space-x-1">
                                    {[...Array(6)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className="w-1 h-4 bg-yellow-300 rounded-full animate-sizzle"
                                            style={{
                                                transform: `rotate(${i * 30}deg)`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Handle */}
                        <div className="absolute -right-8 top-1/2 w-24 h-4 bg-gray-600 rounded-full transform -translate-y-1/2"></div>
                    </div>
                </div>
            </div>

            {/* Progress Ingredients */}
            <div className="flex space-x-4 z-10">
                {['🥑', '🧄', '🍅', '🧀'].map((item, i) => (
                    <span 
                        key={i}
                        className="text-3xl animate-ingredient-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    >
                        {item}
                    </span>
                ))}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(100vh) rotate(0deg); }
                    100% { transform: translateY(-100vh) rotate(360deg); }
                }
                @keyframes sizzle {
                    0% { transform: scaleY(1); }
                    50% { transform: scaleY(1.8); }
                    100% { transform: scaleY(1); }
                }
                @keyframes ingredient-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px) scale(1.2); }
                }
                .animate-float {
                    animation: float 12s linear infinite;
                }
                .animate-sizzle {
                    animation: sizzle 0.4s ease-in-out infinite;
                }
                .animate-ingredient-bounce {
                    animation: ingredient-bounce 1s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default LoadingScreen