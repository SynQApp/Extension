import { TabsProvider } from './Tabs';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  return <TabsProvider>{children}</TabsProvider>;
};
