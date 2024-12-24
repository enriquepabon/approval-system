import React from 'react';
import { useParams } from 'react-router-dom';
import ApprovalView from '../../components/forms/ApprovalView';

const ApprovalPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Pasamos la solicitud ID al componente ApprovalView */}
        <ApprovalView requestId={id} />
      </div>
    </div>
  );
};

export default ApprovalPage;