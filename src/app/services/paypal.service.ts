import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaypalService {
  private sdkPromise?: Promise<void>;

  loadSdk(clientId: string, currency: string): Promise<void> {
    if ((window as any).paypal) {
      return Promise.resolve();
    }

    if (this.sdkPromise) {
      return this.sdkPromise;
    }

    this.sdkPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar PayPal SDK.'));
      document.body.appendChild(script);
    });

    return this.sdkPromise;
  }
}
