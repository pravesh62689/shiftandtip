// scripts/validate-schema.mjs
import https from 'node:https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve, reject);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function extractJsonLd(html) {
  const matches = [];
  const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      matches.push(JSON.parse(match[1]));
    } catch (e) {
      matches.push({ error: e.message, raw: match[1] });
    }
  }
  return matches;
}

function validateSchema(data, url) {
  const errors = [];
  const items = data['@graph'] || (Array.isArray(data) ? data : [data]);

  for (const item of items) {
    if (!item['@type']) {
      errors.push(`Missing @type in schema item on ${url}`);
      continue;
    }

    if (item['@type'] === 'BreadcrumbList') {
      if (!Array.isArray(item.itemListElement) || item.itemListElement.length === 0) {
        errors.push(`BreadcrumbList has empty itemListElement on ${url}`);
      } else {
        item.itemListElement.forEach((el, idx) => {
          if (!el.position || !el.name) {
            errors.push(`BreadcrumbList item #${idx} missing position or name on ${url}`);
          }
        });
      }
    }

    if (item['@type'] === 'Dataset') {
      if (!item.name) errors.push(`Dataset missing name on ${url}`);
      if (!item.description) errors.push(`Dataset missing description on ${url}`);
      if (!item.creator) errors.push(`Dataset missing creator on ${url}`);
    }

    if (item['@type'] === 'WebApplication') {
      if (!item.name) errors.push(`WebApplication missing name on ${url}`);
      if (!item.applicationCategory) errors.push(`WebApplication missing applicationCategory on ${url}`);
    }
  }

  return errors;
}

async function main() {
  console.log('=== Live Schema.org JSON-LD Validation ===');
  const urls = [
    'https://shiftandtip.blogspot.com/2026/11/tip-pool-calculator.html',
    'https://shiftandtip.blogspot.com/p/state-pay-rules-minimum-wage-overtime.html',
    'https://shiftandtip.blogspot.com/p/tip-tools-calculators.html',
    'https://shiftandtip.blogspot.com/p/worker-pay-guides-legal-explainers.html'
  ];

  let totalErrors = 0;
  for (const url of urls) {
    console.log(`Checking ${url}...`);
    const res = await fetchUrl(url);
    if (res.status !== 200) {
      console.log(`  ERROR: Status ${res.status}`);
      totalErrors++;
      continue;
    }

    const jsonLds = extractJsonLd(res.data);
    console.log(`  Found ${jsonLds.length} JSON-LD block(s)`);
    if (jsonLds.length === 0) {
      console.log('  WARNING: No JSON-LD found');
      continue;
    }

    for (const jld of jsonLds) {
      if (jld.error) {
        console.log(`  SYNTAX ERROR: ${jld.error}`);
        totalErrors++;
        continue;
      }
      const errs = validateSchema(jld, url);
      if (errs.length > 0) {
        console.log('  VALIDATION ERRORS:', errs);
        totalErrors += errs.length;
      } else {
        const types = (jld['@graph'] || [jld]).map(x => x['@type']).join(', ');
        console.log(`  VALID Schema types: ${types}`);
      }
    }
  }

  console.log(`=== Schema Validation Complete: ${totalErrors} error(s) ===`);
  if (totalErrors > 0) process.exit(1);
}

main().catch(console.error);
