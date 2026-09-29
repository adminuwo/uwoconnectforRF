'use client';

import React from 'react';

export default function CookieConsentBanner() {
  return null;
}

export const openCookieSettings = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open_cookie_settings'));
  }
};
