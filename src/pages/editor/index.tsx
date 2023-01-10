import { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './index.less';

const Editor: React.FC = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        enableFilePicker: true,
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: 'actionButton',
          img: '...',
          onClick: async () => {
            const doc = documentViewer.getDocument();
            const xfdfString = await annotationManager.exportAnnotations();
            const data = await doc.getFileData({
              // saves the document with annotations in it
              xfdfString,
            });
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: 'application/pdf' });
            window.saveAs(blob, 'downloaded.pdf');
            // Add code for handling Blob here
          },
        });
      });
    });
  }, []);

  return (
    <div className="pdf-editor">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default Editor;
