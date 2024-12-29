import { useEffect, useState } from 'react';
import type { LogViewerProps } from '@patternfly/react-log-viewer';
import { LogViewer as LogViewerOriginal } from '@patternfly/react-log-viewer';

const ClientLogViewer = (props: LogViewerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <LogViewerOriginal {...props} />;
};

export default ClientLogViewer;
