import { Subscription } from "@/lib/types";

const subscription: Subscription[] = [
    {
        id: 'basicUse',
        name: 'Basic',
        description: 'Perfect for individuals looking for a few properties',
        plan: 'monthly',
        amount: 1000,
        accType: "tenant",
        type: 'subscription',
        features: [
            "View 4 Properties",
            "Basic Details",
            "Email Support",
            "Standard Photos",
            "Standard live maps"
        ],
        tax: 0.25,
        constraints: {
            duration: 24 * 60 * 60 * 1000, // 24hours
            viewLimits: 4
        }
    },
    {
        id: 'basic2Use',
        name: "Starter",
        plan: 'monthly',
        amount: 5000,
        accType: "tenant",
        type: 'subscription',
        description: "20",
        constraints: {
            duration: 30 * 24 * 60 * 60 * 1000, // 30 days
        }
    },
    {
        id: 'tenant3moisUse',
        name: "03 Months",
        plan: 'monthly',
        amount: 12000,
        accType: "tenant",
        type: 'subscription',
        description: "60",
        constraints: {
            duration: 3 * 30 * 24 * 60 * 60 * 1000, // 3months
        }
    },
    {
        id: 'tenant6moisUse',
        name: "06 Months",
        plan: 'monthly',
        amount: 20000,
        accType: "tenant",
        type: 'subscription',
        description: "120",
        constraints: {
            duration: 6 * 30 * 24 * 60 * 60 * 1000, // 6months
        },
        features: [
            "Property comparison tools",
            "Customer Support"
        ]
    },
];

export default subscription;