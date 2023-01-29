import { useState } from 'react';
import type { WebViewerInstance } from '@pdftron/webviewer';

export default () => {
  const [instance, setInstance] = useState<WebViewerInstance>();
  const [showWebviewer, setShowWebviewer] = useState<boolean>(false);

  return {
    instance,
    setInstance,
    showWebviewer,
    setShowWebviewer,
  };
};
