import React, { useState } from 'react';
import { SubscriptionManagement } from '../components/SubscriptionManagement';

const subscriptionPlans = [
  {
    id: 'casual',
    name: 'Casual Flavor Adventurer',
    description: 'Moderate heat levels with unique flavors. Perfect for those seeking approachable and fun experiences.',
    priceMonthly: 24.99,
    features: ['3-4 sauces monthly', 'Moderate heat', 'Recipe cards included'],
  },
  {
    id: 'culture',
    name: 'Cultural Food Enthusiast',
    description: 'Authentic sauces with rich backstories and recipe suggestions. For the culturally curious.',
    priceMonthly: 34.99,
    features: ['4-5 sauces monthly', 'Authentic world flavors', 'Detailed tasting notes'],
  },
  {
    id: 'explorer',
    name: 'Heat-Seeker Explorer',
    description: 'Ultra-hot rare sauces with exclusives and limited batches. For the spice challenge lovers.',
    priceMonthly: 44.99,
    features: ['5-6 sauces monthly', 'Extreme heat', 'Limited edition bottles'],
  },
];

const mockUserSubscription = {
  planId: 'culture',
  status: 'active',
  deliveryPreferences: 'Please leave box at front porch if no answer.',
  paymentMethodLast4: '1234',
};

export default function AccountPage() {
  const [userSubscription, setUserSubscription] = useState(mockUserSubscription);

  const handleUpdateSubscription = async (updated: typeof userSubscription) => {
    // Simulate server API call delay
    await new Promise(res => setTimeout(res, 1000));
    // Update local state to mimic save success
    setUserSubscription(updated);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <SubscriptionManagement
        plans={subscriptionPlans}
        userSubscription={userSubscription}
        onUpdateSubscription={handleUpdateSubscription}
      />
    </main>
  );
}
