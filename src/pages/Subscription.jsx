import React , {useState} from 'react';
import '../App.css';
import { CheckCircle } from 'lucide-react';
function Subscription_plan({myPlan, stepProcess, planAmount}) {
    const [SelectedPlan, setSelectedPlan] = useState(null);

    const getSelectedPlan = (option) => {
        setSelectedPlan(option);
        myPlan(option);
        stepProcess('step2')
       
    };
    
    const plans = [
        {
            name: "Basic",
            price: "1000",
            period: "",
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
            price: "3000",
            period: "",
            description: "Ideal for users wanting more options",
            features: [
                "View 8 Properties",
                "Enhanced Details",
                "Priority Support",
                "High-Quality Photos",
                "Premium live maps"
            ],
            popular: false
        },
        {
            name: "Professional",
            price: "5000",
            period: "",
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
            price: "10,000",
            period: "",
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
    <section>
        <div className='mx-auto px-3'>
             {/* pricing plan */}
             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {
                plans.map(
                    (data , index) => {
                        return (
                            <div key={index} className={`border p-4 rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${
                                data.name === "Starter"
                                    ? 'border-2 border-blue-700 bg-blue-700' 
                                    : 'border border-gray-200 bg-white'
                            }`}>
                                <div className={`mb-4 rounded-xl p-4 ${ data.name === "Starter" ? 'bg-blue-800/60':'bg-gray-100'}`}>
                                    <h1 className={`font-Custom font-medium text-sm text-center ${ data.name === "Starter" ? 'text-white':'text-blue-600'}`}>
                                        {data.name}
                                    </h1>
                                    <p className={`text-xs font-Custom font-normal text-center ${ data.name === "Starter" ? 'text-white':'text-gray-600'}`}>
                                        {data.description}
                                    </p>
                                    <h2 className={`font-Custom font-bold text-2xl pt-4 text-center ${ data.name === "Starter" ? 'text-white':'text-gray-800'}`}>
                                        {data.price} XAF
                                    </h2>
                                </div>
                                <ul className='space-y-2 mb-4'>
                                    {data.features.map(
                                        (features, featureIndex) => {
                                            return (
                                                <li key={featureIndex} className='flex items-start gap-2 space-x-2'>
                                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${data.name === "Starter" ? 'text-blue-200' : 'text-green-500'}`} />
                                                    <span className={`text-xs font-Custom font-medium ${data.name === "Starter" ? 'text-blue-100' : 'text-gray-600'}`}>
                                                        {features}
                                                    </span>
                                                </li>
                                            )
                                        }
                                    )}
                                </ul>
                                <button onClick={()=>{getSelectedPlan(data.name);
                                planAmount(data.price);}} className={`w-full py-4 px-4 rounded-lg font-medium transition-all duration-300 mt-auto text-sm ${
                                data.name === "Starter"
                                    ? 'bg-white text-blue-600 hover:bg-gray-100' 
                                    : 'bg-gray-100 hover:bg-blue-600 text-gray-800 hover:text-white'
                                    }`}>
                                    Get Started
                                </button>
                            </div>
                        )
                    } 
                )
             }
             </div>
        </div>
    </section>
  )
}

export default Subscription_plan