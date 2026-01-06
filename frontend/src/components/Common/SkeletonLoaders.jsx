// Reusable Skeleton Loading Components

export const SkeletonCard = ({ className = "" }) => (
    <div className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-200 animate-pulse ${className}`}>
        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    </div>
);

export const SkeletonProductCard = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-gray-200 animate-pulse">
        {/* Image Skeleton */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
            <div className="absolute top-3 right-3 w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content Skeleton */}
        <div className="p-4 space-y-3">
            {/* Title & Rating */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 rounded-lg p-2 space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-2 border-t-2 border-gray-200">
                <div className="space-y-1">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        {/* Header */}
        <div className="bg-gray-100 p-4 border-b border-gray-200">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {[...Array(columns)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-200">
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="p-4">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                        {[...Array(columns)].map((_, colIndex) => (
                            <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonList = ({ items = 5 }) => (
    <div className="space-y-4 animate-pulse">
        {[...Array(items)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="flex gap-2 mt-2">
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonForm = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm animate-pulse">
        <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Form Fields */}
            {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-100 rounded-lg"></div>
                </div>
            ))}

            {/* Textarea */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-100 rounded-lg"></div>
            </div>

            {/* Button */}
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
    </div>
);

export const SkeletonProfile = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full flex-shrink-0"></div>

            {/* Info */}
            <div className="flex-1 w-full space-y-4">
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-4">
                    <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonGrid = ({ items = 6, columns = 3 }) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 sm:gap-6`}>
        {[...Array(items)].map((_, index) => (
            <SkeletonProductCard key={index} />
        ))}
    </div>
);

export const SkeletonHeader = () => (
    <div className="bg-white border-b border-gray-200 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonStats = ({ items = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
        {[...Array(items)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonPage = () => (
    <div className="min-h-screen bg-gray-50">
        <SkeletonHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <SkeletonStats />
            <SkeletonGrid items={6} columns={3} />
        </div>
    </div>
);

export const SkeletonProductView = () => (
    <div className="flex flex-col flex-1 animate-pulse">
        {/* Legal Disclaimer Skeleton */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 pt-16 pb-4">
            <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>

        <div className="w-full max-w-screen-2xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Image Gallery */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                    <div className="flex gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Product Info */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>

                    <div className="h-20 bg-gray-200 rounded-2xl w-1/3"></div>

                    {/* Technical Specs Grid */}
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm border-2 border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-14 bg-gray-200 rounded-xl"></div>
                        <div className="h-14 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonQuotationDetail = () => (
    <div className="flex flex-col flex-1 animate-pulse p-4 md:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="w-24 h-10 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            {/* Legal Disclaimer Skeleton */}
            <div className="h-20 bg-gray-200 rounded-2xl"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-14 bg-gray-50 border-b border-gray-100 px-6 py-4"></div>
                        <div className="p-6 space-y-6">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-6 bg-gray-200 rounded w-32 mt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Skeleton */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                                    <div className="space-y-1 flex-1">
                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonShopHeader = () => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 animate-pulse">
        <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-200 shadow-inner flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
            </div>
        </div>
    </div>
);

// Shimmer effect for better visual
export const SkeletonShimmer = ({ className = "" }) => (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    </div>
);
