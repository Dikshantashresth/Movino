// Layout.tsx

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <><main className=" h-full flex items-center justify-center flex-col">{children}</main></>;
};

export default Layout;
