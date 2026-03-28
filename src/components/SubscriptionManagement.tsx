import React, { useState, useEffect, useCallback } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  features: string[];
}

interface UserSubscription {
  planId: string;
  status: 'active' | 'paused' | 'cancelled';
  deliveryPreferences: string;
  paymentMethodLast4: string;
}

interface SubscriptionManagementProps {
  plans: SubscriptionPlan[];
  userSubscription: UserSubscription;
  onUpdateSubscription: (updated: UserSubscription) => Promise<void>;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ plans, userSubscription, onUpdateSubscription }) => {
  const [currentPlan, setCurrentPlan] = useState(userSubscription.planId);
  const [status, setStatus] = useState<UserSubscription['status']>(userSubscription.status);
  const [deliveryPreferences, setDeliveryPreferences] = useState(userSubscription.deliveryPreferences);
  const [paymentLast4, setPaymentLast4] = useState(userSubscription.paymentMethodLast4);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedPlan = plans.find(p => p.id === currentPlan);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPlan(e.target.value);
  };

  const handleStatusChange = (newStatus: UserSubscription['status']) => {
    setStatus(newStatus);
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDeliveryPreferences(e.target.value);
  };

  // Simulated payment method update (secure area simulated)
  const handlePaymentUpdate = () => {
    // In real app, this triggers a secure payment update flow
    const newLast4 = prompt('Enter last 4 digits of new card (simulated):');
    if (newLast4 && newLast4.length === 4) {
      setPaymentLast4(newLast4);
      setMessage('Payment method updated successfully.');
    } else {
      setMessage('Invalid input. Payment method not updated.');
    }
  };

  const handleSaveChanges = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      await onUpdateSubscription({
        planId: currentPlan,
        status,
        deliveryPreferences,
        paymentMethodLast4: paymentLast4,
      });
      setMessage('Subscription updated successfully.');
    } catch (error) {
      setMessage('Error updating subscription. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPlan, status, deliveryPreferences, paymentLast4, onUpdateSubscription]);

  return (
    <section aria-labelledby="subscription-management-title" className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 id="subscription-management-title" className="text-2xl font-semibold mb-4">Manage Your Subscription</h2>

      <form onSubmit={e => { e.preventDefault(); handleSaveChanges(); }}>
        <label htmlFor="plan-select" className="block font-medium mb-1">
          Subscription Plan
        </label>
        <select
          id="plan-select"
          aria-describedby="plan-desc"
          value={currentPlan}
          onChange={handlePlanChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          disabled={loading}
        >
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - ${plan.priceMonthly.toFixed(2)}/month
            </option>
          ))}
        </select>
        <p id="plan-desc" className="text-gray-600 mb-4">
          {selectedPlan?.description}
        </p>

        <fieldset className="mb-4">
          <legend className="font-medium mb-2">Subscription Status</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="active"
                checked={status === 'active'}
                onChange={() => handleStatusChange('active')}
                disabled={loading}
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="paused"
                checked={status === 'paused'}
                onChange={() => handleStatusChange('paused')}
                disabled={loading}
              />
              Pause
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="cancelled"
                checked={status === 'cancelled'}
                onChange={() => handleStatusChange('cancelled')}
                disabled={loading}
              />
              Cancel
            </label>
          </div>
        </fieldset>

        <label htmlFor="delivery-preferences" className="block font-medium mb-1">
          Delivery Preferences
        </label>
        <textarea
          id="delivery-preferences"
          rows={3}
          className="w-full mb-4 p-2 border border-gray-300 rounded resize-none"
          value={deliveryPreferences}
          onChange={handleDeliveryChange}
          disabled={loading}
          aria-describedby="delivery-info"
          placeholder="E.g., leave package at back door, preferred delivery times, etc."
        />
        <p id="delivery-info" className="text-gray-500 text-sm mb-4">
          Your preferences help us deliver your box smoothly.
        </p>

        <fieldset className="mb-4">
          <legend className="font-medium mb-2">Payment Method</legend>
          <div className="flex items-center justify-between border border-gray-300 rounded p-3">
            <span>Card ending in •••• {paymentLast4}</span>
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
              onClick={handlePaymentUpdate}
              disabled={loading}
              aria-label="Update payment method"
            >
              Update
            </button>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50"
          aria-live="polite"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700" role="alert">
            {message}
          </p>
        )}
      </form>
    </section>
  );
};
