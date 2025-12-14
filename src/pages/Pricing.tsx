import { Header } from '@/components/landing/header';
import { GridBackground } from '@/components/ui/grid-background';
import { Check, X, Zap, Users, Briefcase, Clock, Globe, Lock, MessageSquare, BarChart2, Settings, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '₹0',
      description: 'Perfect for individuals and small projects',
      buttonText: 'Start Free',
      featured: false,
      features: [
        { name: 'Up to 5 projects', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Community support', included: true },
        { name: '1 team member', included: true },
        { name: 'Limited API access', included: true },
        { name: 'Custom domains', included: false },
        { name: 'Advanced security', included: false },
        { name: 'Priority support', included: false },
      ],
    },
    {
      name: 'Professional',
      price: '₹1,299',
      description: 'Designed for growing freelancers & small agencies',
      buttonText: 'Start Free Trial',
      featured: true,
      features: [
        { name: 'Up to 20 projects', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Full API Access', included: true },
        { name: 'Custom domains', included: true },
        { name: 'Up to 5 team members', included: true },
        { name: 'Standard security', included: true },
        { name: 'Priority support', included: false },
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with custom needs',
      buttonText: 'Contact Sales',
      featured: false,
      features: [
        { name: 'Unlimited projects', included: true },
        { name: 'Advanced analytics', included: true },
        { name: '24/7 Priority support', included: true },
        { name: 'Unlimited API Access', included: true },
        { name: 'Custom domains', included: true },
        { name: 'Unlimited team members', included: true },
        { name: 'Enterprise-grade security', included: true },
        { name: 'Dedicated account manager', included: true },
      ],
    },
  ];

  const features = [
    {
      name: 'Projects',
      icon: Briefcase,
      description: 'Number of active projects you can have',
    },
    {
      name: 'Analytics',
      icon: BarChart2,
      description: 'Access to analytics and reporting',
    },
    {
      name: 'Support',
      icon: MessageSquare,
      description: 'Type of customer support available',
    },
    {
      name: 'API Access',
      icon: Settings,
      description: 'Access to our API',
    },
    {
      name: 'Custom Domains',
      icon: Globe,
      description: 'Use your own domain',
    },
    {
      name: 'Team Members',
      icon: Users,
      description: 'Number of team members',
    },
    {
      name: 'Security',
      icon: Lock,
      description: 'Advanced security features',
    },
    {
      name: 'Priority Support',
      icon: Zap,
      description: 'Priority customer support',
    },
  ];

  return (
    <div className="min-h-screen relative bg-transparent">
      <div className="absolute inset-0 bg-white dark:bg-gray-950 -z-20" />
      <Header />
      <GridBackground />
      
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
            Choose the perfect plan for your needs. Start with our free plan and upgrade anytime.
          </p>
        </div>

        {/* Pricing Tabs */}
        <div className="mt-16">
          <div className="hidden lg:grid grid-cols-4 gap-8">
            <div className="col-span-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Features</h3>
              <div className="mt-8 space-y-6">
                {features.map((feature) => (
                  <div key={feature.name} className="pt-6 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 mr-3">
                        <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {feature.name}
                      </span>
                    </div>
                    <p className="mt-2 ml-9 text-sm text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-6",
                  plan.featured 
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20" 
                    : "bg-white dark:bg-gray-800/50 ring-1 ring-gray-200 dark:ring-gray-700"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={cn(
                  "text-lg font-semibold",
                  plan.featured ? "text-white" : "text-gray-900 dark:text-white"
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  "mt-1 text-sm",
                  plan.featured ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"
                )}>
                  {plan.description}
                </p>
                <p className={cn(
                  "mt-4 text-4xl font-bold tracking-tight",
                  plan.featured ? "text-white" : "text-gray-900 dark:text-white"
                )}>
                  {plan.price === 'Custom' ? (
                    <span className="text-3xl font-extrabold">Custom</span>
                  ) : (
                    <>
                      {plan.price}
                      <span className="text-sm font-normal">/month</span>
                    </>
                  )}
                </p>
                <Button
                  variant={plan.featured ? "secondary" : "default"}
                  size="lg"
                  className={cn(
                    "mt-6 w-full",
                    plan.featured && "bg-white text-indigo-600 hover:bg-gray-100 dark:bg-white dark:text-indigo-600 dark:hover:bg-gray-100"
                  )}
                >
                  {plan.buttonText}
                </Button>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className={cn(
                          "h-5 w-5 flex-shrink-0",
                          plan.featured ? "text-green-300" : "text-green-500"
                        )} aria-hidden="true" />
                      ) : (
                        <X className={cn(
                          "h-5 w-5 flex-shrink-0",
                          plan.featured ? "text-red-300" : "text-gray-300 dark:text-gray-600"
                        )} aria-hidden="true" />
                      )}
                      <span className={cn(
                        "ml-3 text-sm",
                        plan.featured 
                          ? feature.included 
                            ? "text-indigo-50" 
                            : "text-indigo-200"
                          : feature.included
                            ? "text-gray-900 dark:text-gray-100"
                            : "text-gray-400 dark:text-gray-500"
                      )}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-8">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-6",
                  plan.featured 
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20" 
                    : "bg-white dark:bg-gray-800/50 ring-1 ring-gray-200 dark:ring-gray-700"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold",
                      plan.featured ? "text-white" : "text-gray-900 dark:text-white"
                    )}>
                      {plan.name}
                    </h3>
                    <p className={cn(
                      "mt-1 text-sm",
                      plan.featured ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {plan.description}
                    </p>
                  </div>
                  <p className={cn(
                    "text-3xl font-bold tracking-tight",
                    plan.featured ? "text-white" : "text-gray-900 dark:text-white"
                  )}>
                    {plan.price}
                    {plan.price !== 'Custom' && <span className="text-sm font-normal">/mo</span>}
                  </p>
                </div>
                <Button
                  variant={plan.featured ? "secondary" : "default"}
                  size="lg"
                  className={cn(
                    "mt-6 w-full",
                    plan.featured && "bg-white text-indigo-600 hover:bg-gray-100 dark:bg-white dark:text-indigo-600 dark:hover:bg-gray-100"
                  )}
                >
                  {plan.buttonText}
                </Button>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {features.slice(0, 4).map((feature, index) => {
                    const planFeature = plan.features[index];
                    return (
                      <div key={feature.name} className="flex items-start">
                        {planFeature?.included ? (
                          <Check className={cn(
                            "h-5 w-5 flex-shrink-0 mt-0.5",
                            plan.featured ? "text-green-300" : "text-green-500"
                          )} aria-hidden="true" />
                        ) : (
                          <X className={cn(
                            "h-5 w-5 flex-shrink-0 mt-0.5",
                            plan.featured ? "text-red-300" : "text-gray-300 dark:text-gray-600"
                          )} aria-hidden="true" />
                        )}
                        <span className={cn(
                          "ml-2 text-sm",
                          plan.featured 
                            ? planFeature?.included
                              ? "text-indigo-50" 
                              : "text-indigo-200"
                            : planFeature?.included
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-400 dark:text-gray-500"
                        )}>
                          {feature.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "mt-4 w-full text-sm",
                    plan.featured ? "text-indigo-100 hover:bg-indigo-700" : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                  )}
                >
                  View all features
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Frequently asked questions</h2>
          <div className="mt-12 space-y-6">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. You'll be charged or credited the difference for the remaining days in your billing cycle."
              },
              {
                question: "Is there a free trial available?",
                answer: "Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support payments via UPI, Net Banking, and PayPal."
              },
              {
                question: "How does the free plan work?",
                answer: "Our free plan includes basic features and is perfect for individuals who want to try out our platform. You can use it for as long as you'd like with no time restrictions."
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
