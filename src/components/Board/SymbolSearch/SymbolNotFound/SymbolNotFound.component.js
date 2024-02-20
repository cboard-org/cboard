import { Typography } from '@material-ui/core';
import { SentimentDissatisfied } from '@material-ui/icons';
import './SymbolNotFound.css';
import { FormattedMessage } from 'react-intl';
import messages from './SymbolNotFound.messages';

function SymbolNotFound() {
  return (
    <div className="SymbolNotFound__box">
      <SentimentDissatisfied />
      <Typography variant="h5">
        <FormattedMessage {...messages.symbolNotFoundTitle} />
      </Typography>
      <Typography>
        <FormattedMessage {...messages.symbolNotFoundText} />
      </Typography>
    </div>
  );
}
export default SymbolNotFound;
