import { useState } from 'react';
import type { WebViewerInstance } from '@pdftron/webviewer';

export default () => {
  const [instance, setInstance] = useState<WebViewerInstance>();

  return {
    instance,
    setInstance,
  };
};
