import { Subscription } from "@/lib/(ado)/types";

const subscription: Omit<Subscription, 'state'>[] = [
    {
        id: 'tenantdailyUse',
        name: 'Daily Access',
        plan: 'daily',
        amount: 1000,
        accType: "tenant",
        type: 'subscription',
        limit: 5,
        features: [
            "Direct Messaging with Landlord",
            "Reminder on ",
            "Rental application tracking"
        ],
        tax: 0.25,
        constraints: {
            duration: 24 * 60 * 60 * 1000, // 24hours
        }
    },
    {
        id: 'tenant1moisUse',
        name: "Monthly",
        plan: 'monthly',
        amount: 5000,
        accType: "tenant",
        type: 'subscription',
        limit: 20,
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
        limit: 60,
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
        limit: 120,
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