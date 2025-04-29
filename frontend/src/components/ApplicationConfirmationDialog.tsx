import React from 'react';
import Card from './Card';
import Button from './Button';

interface ApplicationConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  company: string;
}

const ApplicationConfirmationDialog: React.FC<ApplicationConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  company,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card variant="elevated" className="max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Did you apply to this job?</h3>
          <p className="text-gray-600 mb-4">
            {jobTitle} at {company}
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              No, not yet
            </Button>
            <Button
              onClick={onConfirm}
            >
              Yes, I applied
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationConfirmationDialog; 