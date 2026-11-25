export const ASSET_VERSION = 'v1.0.4';
export const CDN_BASE = `https://cdn.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@${ASSET_VERSION}`;
export const CDN_FALLBACK = `https://fastly.jsdelivr.net/gh/pravesh62689/shiftandtip-assets@${ASSET_VERSION}`;
export const PAGES_BASE = 'https://shiftandtip-assets.pages.dev';
export const AUTHOR_NAME = 'Pravesh Rathore';
export const BLOG_URL = 'https://shiftandtip.blogspot.com';
export const ADS_ENABLED = false;
export const PUB_ID = '';
export const AFFILIATES_ENABLED = false;
export const AFFILIATE_PROGRAMS = {
  SEVENSHIFTS_ID: process.env.SEVENSHIFTS_ID || '',
  GUSTO_ID: process.env.GUSTO_ID || '',
  HOMEBASE_ID: process.env.HOMEBASE_ID || '',
  TURBOTAX_ID: process.env.TURBOTAX_ID || '',
  TAXACT_ID: process.env.TAXACT_ID || '',
  ADP_ID: process.env.ADP_ID || '',
};


