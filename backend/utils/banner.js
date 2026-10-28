import { isRedisEnabled } from '../config/redisClient.js';

export const printServerBanner = ({ port }) => {
  const c = {
    cyan: '\x1b[36m',
    boldCyan: '\x1b[1;36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    bold: '\x1b[1m',
    reset: '\x1b[0m',
  };

  const redisActive = isRedisEnabled();
  const redisText = redisActive
    ? `${c.green}ENABLED ${c.gray}(${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'})${c.reset}`
    : `${c.yellow}DISABLED ${c.gray}(In-Memory Fallback Active)${c.reset}`;

  const banner = `
${c.cyan}  ██╗  ██╗██████╗ ███████╗██████╗ ████████╗ ██████╗   █████╗ 
  ╚██╗██╔╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔═══██╗ ██╔══██╗
   ╚███╔╝ ██████╔╝█████╗  ██████╔╝   ██║   ██║   ██║ ███████║
   ██╔██╗ ██╔═══╝ ██╔══╝  ██╔══██╗   ██║   ██║   ██║ ██╔══██║
  ██╔╝ ██╗██║     ███████╗██║  ██║   ██║   ╚██████╔╝ ██║  ██║
  ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═╝  ╚═╝${c.reset}
       ${c.bold}${c.magenta}E X P E R T Q A${c.reset}  ${c.gray}|${c.reset}  ${c.bold}L M S   B A C K E N D   E N G I N E${c.reset}

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
