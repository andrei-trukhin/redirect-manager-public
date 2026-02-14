import React from 'react';
import Alert from './Alert';
import DetailField from "./DetailField.tsx";
import {Key} from "lucide-react";

export interface TokenDisplayProps {
  token: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ token }) => {
  return (
    <div className="space-y-4">
      <Alert variant="warning">
        Make sure to copy your API token now. You won't be able to see it again!
      </Alert>
      <div className="flex gap-2">
          <DetailField
              icon={Key}
              label="API Token"
              value={token}
              canCopy
              hint="Use this token to authenticate API requests. Keep it secret and secure."
          />
      </div>
    </div>
  );
};

export default TokenDisplay;

