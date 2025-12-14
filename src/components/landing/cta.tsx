// src/components/landing/cta.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to grow your freelance business?</h2>
          <p className="mt-4 text-lg text-primary-100">
            Join thousands of freelancers who trust GrowSuite to manage their clients and projects.
          </p>
          <div className="flex flex-col mt-8 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
            <Button size="lg" className="px-8 py-6 text-lg font-semibold bg-white text-primary hover:bg-gray-100">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold text-white border-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}