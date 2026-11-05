import { isRedisEnabled } from '../config/redisClient.js';
import { APP_DISPLAY_NAME, APP_SHORT_NAME, APP_TAGLINE } from './appBrand.js';

export const printServerBanner = ({ port }) => {
  const c = {
    cyan: '\x1b[36m',
    boldCyan: '\x1b[1;36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
    brown: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    bold: '\x1b[1m',
    reset: '\x1b[0m',
  };

  const redisActive = isRedisEnabled();
  const redisText = redisActive
    ? `${c.green}ENABLED ${c.gray}(${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'})${c.reset}`
    : `${c.yellow}DISABLED ${c.gray}(In-Memory Fallback Active)${c.reset}`;

  const titleLine = APP_DISPLAY_NAME.toUpperCase();
  const subtitle = `${APP_SHORT_NAME} · LMS Backend`;

  const banner = `
${c.bold}${c.magenta}  ╔══════════════════════════════════════════════════════════════════╗${c.reset}
${c.bold}${c.magenta}  ║${c.reset}  ${c.bold}${c.cyan}${titleLine.padEnd(62)}${c.reset}${c.bold}${c.magenta}║${c.reset}
${c.bold}${c.magenta}  ║${c.reset}  ${c.gray}${subtitle.padEnd(62)}${c.reset}${c.bold}${c.magenta}║${c.reset}
${c.bold}${c.magenta}  ╚══════════════════════════════════════════════════════════════════╝${c.reset}
       ${c.gray}${APP_TAGLINE}${c.reset}

${c.gray}┌────────────────────────────────────────────────────────────────────────┐${c.reset}
${c.gray}│${c.reset}  ${c.bold}🚀 Server Status${c.reset}  : ${c.green}ONLINE (HTTP + WebSocket Engine)${c.reset}
${c.gray}│${c.reset}  ${c.bold}🌐 Local Address${c.reset}  : ${c.cyan}http://localhost:${port}${c.reset}
${c.gray}│${c.reset}  ${c.bold}🍃 Database${c.reset}       : ${c.green}MongoDB Connected${c.reset}
${c.gray}│${c.reset}  ${c.bold}⚡ Redis Cache${c.reset}    : ${redisText}
${c.gray}│${c.reset}  ${c.bold}🌍 Environment${c.reset}    : ${c.blue}${process.env.NODE_ENV || 'development'}${c.reset}
${c.gray}└────────────────────────────────────────────────────────────────────────┘${c.reset}
`;

  console.log(banner);
};
