import { motion } from 'framer-motion';
import { CheckCircle, FileText, Users, Zap, LayoutDashboard, BarChart3, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: "Simplify Your Workflow",
    description: "Eliminate clutter with our intuitive interface designed for maximum productivity and ease of use.",
    highlights: [
      "Clean, distraction-free interface",
      "Quick access to key features",
      "Customizable dashboard"
    ],
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Smart Invoicing",
    description: "Generate professional invoices in seconds and share them directly with clients through their portal.",
    highlights: [
      "One-click invoice generation",
      "Client portal access",
      "Automated payment reminders"
    ],
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Client Collaboration",
    description: "Keep clients in the loop with real-time updates and a dedicated client portal.",
    highlights: [
      "Direct client communication",
      "Project progress tracking",
      "Document sharing"
    ],
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Data-Driven Insights",
    description: "Make informed decisions with beautiful, actionable analytics and reports.",
    highlights: [
      "Real-time performance metrics",
      "Custom report generation",
      "Business growth tracking"
    ],
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Time Management",
    description: "Track time effortlessly and bill accurately with our built-in time tracking tools.",
    highlights: [
      "Automatic time tracking",
      "Billable hours calculator",
      "Timesheet approvals"
    ],
    color: "bg-rose-500/10 text-rose-500"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Enterprise Security",
    description: "Your data is protected with enterprise-grade security and compliance measures.",
    highlights: [
      "Bank-level encryption",
      "Regular security audits",
      "Role-based access control"
    ],
    color: "bg-indigo-500/10 text-indigo-500"
  }
];

export function FeatureCards() {
  return (
    <section className="relative py-20 md:py-28 bg-background">
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Boost Productivity
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed to simplify your workflow and help your business grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full flex flex-col p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3 mt-auto">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
