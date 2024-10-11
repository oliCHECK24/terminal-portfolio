'use client';

import * as serviceWorkerRegistration from "@/services/serviceWorkerRegistration";




export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    if (typeof window !== 'undefined' && window.location.hostname) {
        serviceWorkerRegistration.register();
    }

  return (<>{children}</>
  );
}



