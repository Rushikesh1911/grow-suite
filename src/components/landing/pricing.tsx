// src/components/landing/pricing.tsx
export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your freelance business.
          </p>
        </div>
        {/* Pricing cards will go here */}
      </div>
    </section>
  );
}