import React, { useState } from 'react';
import CreateDocumentForm1 from './components/CreateDocumentForm1';
import CreateDocumentForm2 from './components/CreateDocumentForm2';
import './index.less';
const NewPDF: React.FC = () => {
  const [createType, setCreateType] = useState('1');
  return (
    <div className="create-document-page">
      <div className="create-document">
        <div className="create-type">
          <div
            className={`create-type-item ${createType === '1' ? 'active' : ''}`}
            onClick={() => setCreateType('1')}
          >
            空白文档
          </div>
          <div
            className={`create-type-item ${createType === '2' ? 'active' : ''}`}
            onClick={() => setCreateType('2')}
          >
            来自图像的PDF
          </div>
        </div>
        <div className="create-content">
          {createType === '1' ? (
            <CreateDocumentForm1 />
          ) : (
            <CreateDocumentForm2 />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPDF;
