import React, { useState } from 'react';
import { CheckCircle, Star } from 'lucide-react';

function Subscription({ 
  onPlanSelect = () => {}, 
  onStepChange = () => {}, 
  onAmountChange = () => {} 
}) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelect = (planName, planPrice) => {
    setSelectedPlan(planName);
    onPlanSelect(planName);
    onAmountChange(planPrice);
    onStepChange('step2');
  };

  const plans = [
    {
      name: "Basic",
      price: 1000,
      description: "Perfect for individuals looking for a few properties",
      features: [
        "View 4 Properties",
        "Basic Details",
        "Email Support",
        "Standard Photos",
        "Standard live maps"
      ],
      popular: false
    },
    {
      name: "Starter",
      price: 3000,
      description: "Ideal for users wanting more options",
      features: [
        "View 8 Properties",
        "Enhanced Details",
        "Priority Support",
        "High-Quality Photos",
        "Premium live maps"
      ],
      popular: true
    },
    {
      name: "Professional",
      price: 5000,
      description: "Best for serious property seekers",
      features: [
        "View 12 Properties",
        "Premium Details",
        "24/7 Support",
        "HD Photos & Videos",
        "Premium live maps"
      ],
      popular: false
    },
    {
      name: "Enterprise",
      price: 10000,
      description: "Complete solution for extensive searches",
      features: [
        "View 16 Properties",
        "Premium Details",
        "Dedicated Manager",
        "HD Photos & Videos",
        "Premium live maps"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your property search needs. All plans include access to our platform features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.name;
            const isPopular = plan.popular;

            return (
              <div
                key={index}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                  isPopular
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl scale-105 border-2 border-blue-500'
                    : isSelected
                    ? 'bg-white shadow-lg border-2 border-blue-500'
                    : 'bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300'
                }`}>
                
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Star size={12} fill="currentColor" />
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && !isPopular && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle size={12} />
                      SELECTED
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div
                  className={`p-6 rounded-xl m-4 mb-0 ${
                    isPopular ? 'bg-blue-800/40' : 'bg-gray-50'
                  }`}>
                  <h3
                    className={`text-lg font-semibold text-center mb-2 ${
                      isPopular ? 'text-white' : 'text-blue-600'
                    }`}>
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs text-center mb-4 ${
                      isPopular ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                    {plan.description}
                  </p>
                  <div className="text-center">
                    <span
                      className={`text-3xl sm:text-4xl font-bold ${
                        isPopular ? 'text-white' : 'text-gray-900'
                      }`}>
                      {plan.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm ml-1 ${
                        isPopular ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                      FCFA
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-6 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            isPopular ? 'text-blue-200' : 'text-green-500'
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            isPopular ? 'text-blue-50' : 'text-gray-700'
                          }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handlePlanSelect(plan.name, plan.price)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      isPopular
                        ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg'
                        : isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white'
                    }`}>
                    {isSelected ? 'Selected' : 'Get Started'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            ✓ Secure Payment • ✓ Cancel Anytime • ✓ Money-back Guarantee
          </p>
        </div>
      </div>
    </section>
  );
}

export default Subscription;