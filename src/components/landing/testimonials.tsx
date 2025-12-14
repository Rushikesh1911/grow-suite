// src/components/landing/testimonials.tsx
export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-950">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Trusted by Freelancers</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Join thousands of freelancers who have streamlined their workflow with GrowSuite.
          </p>
        </div>
        {/* Testimonial cards will go here */}
      </div>
    </section>
  );
}