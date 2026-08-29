'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const EntitlementContext = createContext(null);

export function EntitlementProvider({ children }) {
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upgrade Modal Global State
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    itemName: '',
    itemType: 'feature', // feature | connector | channel
    requiredPlan: 'Growth'
  });

  const fetchEntitlements = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('token') || localStorage.getItem('uwo_token')) 
        : null;
      const res = await axios.get(`${API_BASE_URL}/api/client/entitlements/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setEntitlements(res.data);
      setError(null);
    } catch (err) {
      console.warn("Failed to fetch entitlements:", err?.response?.data || err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  const openUpgradeModal = useCallback(({ itemName = 'Feature', itemType = 'feature', requiredPlan = 'Growth' }) => {
    setUpgradeModal({
      isOpen: true,
      itemName,
      itemType,
      requiredPlan
    });
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const selectChannel = useCallback(async (channelKey) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await axios.post(
        `${API_BASE_URL}/client/select-channel/`,
        { action: 'select_channel', channel: channelKey },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      await fetchEntitlements();
      return { success: true, data: res.data };
    } catch (err) {
      const errMsg = err?.response?.data?.error || err.message;
      if (err?.response?.status === 403) {
        const requiredPlan = entitlements?.plan?.max_channels === 1 ? 'Growth' : 'Advanced';
        openUpgradeModal({
          itemName: `${channelKey} Channel`,
          itemType: 'channel',
          requiredPlan
        });
      }
      return { success: false, error: errMsg };
    }
  }, [fetchEntitlements, entitlements, openUpgradeModal]);

  const subscribePlan = useCallback(async (planSlug, billingPeriod = 'MONTHLY') => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await axios.post(
        `${API_BASE_URL}/client/subscribe/`,
        { action: 'subscribe', plan_slug: planSlug, billing_period: billingPeriod },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      await fetchEntitlements();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err?.response?.data?.error || err.message };
    }
  }, [fetchEntitlements]);

  return (
    <EntitlementContext.Provider
      value={{
        entitlements,
        loading,
        error,
        refreshEntitlements: fetchEntitlements,
        selectChannel,
        subscribePlan,
        upgradeModal,
        openUpgradeModal,
        closeUpgradeModal
      }}
    >
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement() {
  const context = useContext(EntitlementContext);
  if (!context) {
    // Return graceful fallback object if provider is not mounted
    return {
      entitlements: null,
      loading: false,
      error: null,
      refreshEntitlements: () => {},
      selectChannel: async () => ({ success: false }),
      subscribePlan: async () => ({ success: false }),
      upgradeModal: { isOpen: false, itemName: '', itemType: 'feature', requiredPlan: 'Growth' },
      openUpgradeModal: () => {},
      closeUpgradeModal: () => {}
    };
  }
  return context;
}
