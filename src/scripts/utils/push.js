import { subscribeNotification, unsubscribeNotification } from "../data/api";

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

const SUBSCRIPTION_KEY = "push-subscription";
const PUSH_ENABLED_KEY = "push-enabled";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function isPushEnabled() {
  return localStorage.getItem(PUSH_ENABLED_KEY) === "true";
}

export function setPushEnabled(v) {
  localStorage.setItem(PUSH_ENABLED_KEY, v ? "true" : "false");
}

export function getStoredSubscription() {
  const raw = localStorage.getItem(SUBSCRIPTION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function normalizeSubscription(subscription) {
  const payload =
    typeof subscription?.toJSON === "function"
      ? subscription.toJSON()
      : subscription;

  return {
    endpoint: payload.endpoint,
    keys: {
      p256dh: payload.keys?.p256dh || "",
      auth: payload.keys?.auth || "",
    },
  };
}

export function storeSubscription(sub) {
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub));
}

export function clearStoredSubscription() {
  localStorage.removeItem(SUBSCRIPTION_KEY);
}

export async function requestPermissionAndSubscribe() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker not supported");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission not granted");
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const subscriptionPayload = normalizeSubscription(subscription);
  storeSubscription(subscriptionPayload);
  setPushEnabled(true);

  await subscribeNotification(subscriptionPayload);

  return subscription;
}

export async function unsubscribe() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await unsubscribeNotification(subscription.endpoint);
    await subscription.unsubscribe();
  }
  clearStoredSubscription();
  setPushEnabled(false);
}

// Optional: if backend provides endpoint to register subscription, wire it here.
// For now we only subscribe client-side; API trigger must be implemented on server.
export async function ensureSubscribedIfEnabled() {
  const enabled = isPushEnabled();
  if (!enabled) return null;

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    const subscriptionPayload = normalizeSubscription(subscription);
    storeSubscription(subscriptionPayload);
    await subscribeNotification(subscriptionPayload);
    return subscription;
  }

  // If enabled flag true but no subscription, attempt re-subscribe.
  return await requestPermissionAndSubscribe();
}
