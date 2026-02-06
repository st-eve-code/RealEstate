export const pointStatus = {
    "Free Tier": 0,
    "Upcoming": 1, //from 1 to next
    "Wanderer": 50, // from 50 to next
    "Touristic": 120,
    "Adventurer": 300,
    "Infinity": 500
}

export const serviceFee = {
    amount: 0
}

export const mainCurrency = "FCFA";

// converting from main currency to this currency
export const currencyConversion = [
    {
        divider: 659,
        multiplier: 1,
        currency: "EUR"
    }
]