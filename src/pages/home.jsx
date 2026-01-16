
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      {/* Hero Section */}
      <div className="relative bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
              Find Your Dream Property with <span className="text-brand-accent">Viewora</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 mb-10">
              The professional choice for buying, selling, and renting premium real estate. Trusted by thousands of brokers and property owners.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white text-brand-primary font-bold rounded-md hover:bg-gray-100 transition shadow-lg"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-brand-accent text-white font-bold rounded-md hover:bg-blue-600 transition shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-brand-primary">Why Choose Viewora?</h2>
            <p className="mt-4 text-lg text-text-muted">Experience the future of real estate management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-bg-page rounded-lg border border-gray-100 hover:shadow-md transition">
              <div className="text-brand-accent text-2xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">Premium Listings</h3>
              <p className="text-text-muted">Access valid, verified, and high-quality property listings curated for you.</p>
            </div>
            <div className="p-6 bg-bg-page rounded-lg border border-gray-100 hover:shadow-md transition">
              <div className="text-brand-accent text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">Verified Brokers</h3>
              <p className="text-text-muted">Connect with certified professionals and owners transparently.</p>
            </div>
            <div className="p-6 bg-bg-page rounded-lg border border-gray-100 hover:shadow-md transition">
              <div className="text-brand-accent text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">Instant Communication</h3>
              <p className="text-text-muted">Chat and video call directly through our secure platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
