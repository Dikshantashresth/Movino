// Layout.tsx

import React, { Suspense } from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <><main className=" h-full flex items-center justify-center flex-col"><Suspense>{children}</Suspense></main></>;
};

export default Layout;
