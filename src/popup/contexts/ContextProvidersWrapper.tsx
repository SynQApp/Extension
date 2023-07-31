import { CurrentSongInfoProvider } from './CurrentSongInfo';
import { ExpandedProvider } from './Expanded';
import { PlaybackStateProvider } from './PlaybackState';
import { TabsProvider } from './Tabs';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  return (
    <TabsProvider>
      <PlaybackStateProvider>
        <CurrentSongInfoProvider>
          <ExpandedProvider>{children}</ExpandedProvider>
        </CurrentSongInfoProvider>
      </PlaybackStateProvider>
    </TabsProvider>
  );
};
