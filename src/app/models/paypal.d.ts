interface PaypalOrderActions {
  order: {
    create: (payload: unknown) => Promise<string>;
    capture: () => Promise<unknown>;
  };
}

interface PaypalButtonsOptions {
  createOrder: (data: unknown, actions: PaypalOrderActions) => Promise<string>;
  onApprove: (data: unknown, actions: PaypalOrderActions) => Promise<void>;
  onError?: (err: unknown) => void;
  onCancel?: () => void;
}

interface PaypalButtonsInstance {
  render: (selector: string) => Promise<void>;
}

interface PaypalNamespace {
  Buttons: (options: PaypalButtonsOptions) => PaypalButtonsInstance;
}

interface Window {
  paypal?: PaypalNamespace;
}
