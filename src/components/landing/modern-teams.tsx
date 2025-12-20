import { motion } from 'framer-motion';
import { Target, Zap, BarChart3, ArrowRight, Users, Briefcase, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "Modern Teams",
    description: "Empower your team with intuitive tools designed for seamless collaboration and productivity.",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Focused Execution",
    description: "Eliminate distractions and focus on what moves the needle with our intuitive interface.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Rapid Growth",
    description: "Scale your operations without the growing pains. Our platform grows with your business needs.",
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Data Insights",
    description: "Make informed decisions with real-time analytics and beautiful dashboards.",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Business Ready",
    description: "Enterprise-grade security and reliability for businesses of all sizes.",
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Proven Results",
    description: "Join thousands of businesses accelerating their growth with our platform.",
    color: "bg-rose-500/10 text-rose-500"
  }
];

export function ModernTeams() {
  return (
    <section className="relative py-20 md:py-28 bg-background">
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            For Teams
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for modern business teams
          </h2>
          <p className="text-lg text-muted-foreground">
            GrowSuite CRM is designed to help your team work smarter, not harder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full flex flex-col p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="group">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              See How It Works
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
