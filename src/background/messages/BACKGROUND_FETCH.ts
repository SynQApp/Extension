import type { PlasmoMessaging } from '@plasmohq/messaging';

interface BackgroundFetchRequest {
  input: RequestInfo | URL;
  init?: RequestInit;
}

/**
 * A handler to perform a fetch from the background script.
 */
const handler: PlasmoMessaging.MessageHandler<BackgroundFetchRequest> = async (
  req,
  res
) => {
  const fetchArgs = req.body;

  const response = await fetch(fetchArgs.input, fetchArgs.init).then(
    (response) => response.text()
  );

  res.send(response);
};

export default handler;
