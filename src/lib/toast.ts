'use client';

import { toast as sonnerToast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

export function showToast(message: string, type: ToastType = "info") {
  const toastFunctions = {
    success: sonnerToast.success,
    error: sonnerToast.error,
    info: sonnerToast,
    warning: sonnerToast.warning,
  };

  toastFunctions[type](message);
}

export function showBankConnectionError() {
  showToast("Failed to connect to bank. Please try again.", "error");
}

export function showGmailSyncError() {
  showToast("Gmail sync failed. Re-authentication may be required.", "warning");
}

export function showSubscriptionCancelled(name: string) {
  showToast(`${name} marked for cancellation.`, "success");
}

export function showZombieAlert(subscriptionName: string, amount: number) {
  showToast(`Zombie alert: ${subscriptionName} charged $${amount.toFixed(2)} after cancellation!`, "error");
}
