import AIChatBot from "../../components/ai/AIChatBot";

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-primary">
            Viewora AI Advisor
          </h1>
          <p className="text-text-muted mt-2">
            Get hyper-local real estate analysis, pricing trends, and market insights powered by Viewora RAG.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-[700px]">
          <AIChatBot />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-brand-primary mb-1">Market Trends</h3>
            <p className="text-xs text-gray-500">Real-time data on price fluctuations and demand in your target areas.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-brand-primary mb-1">Local Insights</h3>
            <p className="text-xs text-gray-500">Detailed information about neighborhood amenities and development.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-brand-primary mb-1">Investment Score</h3>
            <p className="text-xs text-gray-500">AI-driven analysis of property value appreciation potential.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
