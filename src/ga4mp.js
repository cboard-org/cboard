import ga4mp from '@rodrisanchez12/ga4mp';
import { GA4_MEASUREMENT_ID } from './constants';

const ga4track = ga4mp([GA4_MEASUREMENT_ID], {
  non_personalized_ads: true,
  debug: false,
  user_agent:
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
});

export default ga4track;
