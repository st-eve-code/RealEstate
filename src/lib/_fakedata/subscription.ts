import { serverTimestamp, Timestamp } from "firebase/firestore";
import { Plan, Subscription } from "../types";

const subscription: Plan[] = [
    {
        id: 'basicUse',
        name: 'Basic',
        description: 'Perfect for individuals looking for a few properties',
        plan: 'monthly',
        price: 1000,
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
        },
        createdBy:{
            id: '',
            name: ''
        },
        createdAt: Timestamp.now(),
        points: 3
    },
    {
        id: 'basic2Use',
        name: "Starter",
        plan: 'monthly',
        price: 5000,
        accType: "tenant",
        type: 'subscription',
        description: "20",
        constraints: {
            duration: 30 * 24 * 60 * 60 * 1000, // 30 days
            viewLimits: 10
        },
        features: [
            "View 4 Properties",
            "Basic Details",
            "Email Support",
            "Standard Photos",
            "Standard live maps"
        ],
        tax: 0.25,
        createdBy:{
            id: '',
            name: ''
        },
        createdAt: Timestamp.now(),
        points: 10
    },
    {
        id: 'tenant3moisUse',
        name: "03 Months",
        plan: 'monthly',
        price: 12000,
        accType: "tenant",
        type: 'subscription',
        description: "60",
        constraints: {
            duration: 3 * 30 * 24 * 60 * 60 * 1000, // 3months
        },
        features: [
            "View 4 Properties",
            "Basic Details",
            "Email Support",
            "Standard Photos",
            "Standard live maps"
        ],
        tax: 0.25,
        createdBy:{
            id: '',
            name: ''
        },
        createdAt: Timestamp.now(),
        points: 20
    },
    {
        id: 'tenant6moisUse',
        name: "06 Months",
        plan: 'monthly',
        price: 20000,
        accType: "tenant",
        type: 'subscription',
        description: "120",
        constraints: {
            duration: 6 * 30 * 24 * 60 * 60 * 1000, // 6months
        },
        features: [
            "Property comparison tools",
            "Customer Support"
        ],
        tax: 0.25,
        createdBy:{
            id: '',
            name: ''
        },
        createdAt: Timestamp.now(),
        points: 50
    },
];

export default subscription;