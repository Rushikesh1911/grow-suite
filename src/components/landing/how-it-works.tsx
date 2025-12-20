import { motion } from 'framer-motion';
import { CheckCircle, UserPlus, ClipboardList, CreditCard, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="w-5 h-5" />,
      title: "Add Client",
      description: "Quickly onboard new clients with our intuitive form. Store all client details in one secure location.",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      title: "Create Project",
      description: "Set up projects with custom requirements, deadlines, and team assignments in seconds.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Process Payment",
      description: "Securely process payments and track transactions with our integrated payment system.",
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Deliver & Complete",
      description: "Mark projects as complete and request client feedback to improve your services.",
      color: "bg-amber-500/10 text-amber-500"
    }
  ];

  return (
    <section className="relative py-20 md:py-28 bg-background">
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            Workflow
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How GrowSuite Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Streamline your workflow with our simple 4-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full flex flex-col p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 ${step.color}`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <span className="text-sm font-medium text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {step.description}
                  </p>
                </div>
                <div className="flex items-center text-sm font-medium text-primary mt-auto pt-4 border-t border-border/20">
                  Learn more
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 group"
          >
            Get Started with GrowSuite
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
