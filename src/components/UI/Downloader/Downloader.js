import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Axios from 'axios';

import './Downloader.css';
import messages from './Downloader.messages';

const Downloader = ({ files = [], completed }) => {
  return (
    <div className="downloader">
      <ul>
        {files.map((file, idx) => (
          <DownloadItem
            key={idx}
            completedFile={blob => completed(blob)}
            {...file}
          />
        ))}
      </ul>
    </div>
  );
};

const DownloadItem = ({ name, file, filename, completedFile }) => {
  const [downloadInfo, setDownloadInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
    loaded: 0
  });

  useEffect(() => {
    const options = {
      onDownloadProgress: progressEvent => {
        const { loaded, total } = progressEvent;

        setDownloadInfo({
          progress: Math.floor((loaded * 100) / total),
          loaded,
          total,
          completed: false
        });
      }
    };

    Axios.get(file, {
      responseType: 'blob',
      ...options
    }).then(function(response) {
      setDownloadInfo(info => ({
        ...info,
        completed: true
      }));

      setTimeout(() => {
        completedFile(
          new Blob([response.data], {
            type: response.headers['content-type']
          })
        );
      }, 2000);
    });
  }, []);

  const formatBytes = bytes => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div>
      <li>
        <Typography variant="subtitle1" color="primary">
          {name}
        </Typography>
        <Typography variant="body1" color="primary">
          {downloadInfo.loaded > 0 && (
            <>
              <span>{formatBytes(downloadInfo.loaded)}</span>/{' '}
              {formatBytes(downloadInfo.total)}
            </>
          )}
          {downloadInfo.loaded === 0 && (
            <FormattedMessage {...messages.initializing} />
          )}
        </Typography>
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <LinearProgress
              variant="determinate"
              color="primary"
              value={downloadInfo.progress}
            />
          </Box>
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${Math.round(
              downloadInfo.progress
            )}%`}</Typography>
          </Box>
        </Box>
        <Typography variant="body1" color="textSecondary">
          {downloadInfo.completed && (
            <span className="downloader__text-success">
              <FormattedMessage {...messages.completed} />
            </span>
          )}
        </Typography>
      </li>
    </div>
  );
};

export default Downloader;
