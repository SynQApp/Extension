import type { PlasmoMessaging } from '@plasmohq/messaging';

interface RedirectToTabBody {
  tabName: string;
  searchParams: Record<string, string>;
}

/**
 *
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { tabName, searchParams } = req.body as RedirectToTabBody;

  chrome.windows.create({
    url: `http://localhost:3000/spotify/login?${new URLSearchParams(
      searchParams
    ).toString()}`,
    type: 'popup',
    width: 800,
    height: 600
  });

  res.send(undefined);
};

export default handler;
