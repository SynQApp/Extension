import type { PlasmoMessaging } from '@plasmohq/messaging';

interface BackgroundFetchRequest {
  // The arguments to pass into fetch
  input: RequestInfo | URL;
  init?: RequestInit;
}

const handler: PlasmoMessaging.MessageHandler<BackgroundFetchRequest> = async (
  req,
  res
) => {
  console.log('Received background fetch request', req.body);
  const fetchArgs = req.body;

  const response = await fetch(fetchArgs.input, fetchArgs.init).then(
    (response) => response.text()
  );

  console.log(response);

  res.send(response);
};

export default handler;
