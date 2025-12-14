// src/components/landing/features.tsx
export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Powerful Features</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to manage your freelance business in one place.
          </p>
        </div>
        {/* Feature cards will go here */}
      </div>
    </section>
  );
}