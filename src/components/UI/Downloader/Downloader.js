import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Axios from 'axios';

import './Downloader.css';
import messages from './Downloader.messages';

const Downloader = ({ files = [], completed, processing }) => {
  return (
    <div className="downloader">
      <ul>
        {files.map((file, idx) => (
          <DownloadItem
            key={idx}
            completedFile={blob => completed(blob)}
            processing={processing}
            {...file}
          />
        ))}
      </ul>
    </div>
  );
};

const DownloadItem = ({
  name,
  file,
  filename,
  completedFile,
  processing,
  onError
}) => {
  const [downloadInfo, setDownloadInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
    loaded: 0
  });

  useEffect(
    () => {
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
      })
        .then(function(response) {
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
          }, 3000);
        })
        .catch(function(err) {
          console.error('Error downloading file. Error: ' + err.message);
          onError(err.message);
        });
    },
    [completedFile, file, onError]
  );

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
        <Typography variant="body1">
          {downloadInfo.completed && !processing && (
            <span className="downloader__text-success">
              <FormattedMessage {...messages.completed} />
            </span>
          )}
        </Typography>
        <Typography variant="body1">
          {processing === 'doing' && (
            <span className="downloader__text-success">
              <FormattedMessage {...messages.processing} />
            </span>
          )}
        </Typography>
        <Typography variant="body1">
          {processing === 'done' && (
            <span className="downloader__text-success">
              <FormattedMessage {...messages.processingDone} />
            </span>
          )}
        </Typography>
        <Typography variant="body1">
          {processing === 'error' && (
            <span className="downloader__text-error">
              <FormattedMessage {...messages.processingError} />
            </span>
          )}
        </Typography>
      </li>
    </div>
  );
};

export default Downloader;
