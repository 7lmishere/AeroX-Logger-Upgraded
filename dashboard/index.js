const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const config = require('../../config');
const { getGuildSettings, updateGuildSettings, db } = require('../utils/database');
const { printLoading, printSuccess, printInfo } = require('../utils/startup');

module.exports = (client) => {
  const app = express();
  const port = process.env.PORT || config.DASHBOARD_PORT || 5000;

  printLoading('Dashboard initialization');

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // =========================================================
  // Cookie Parser
  // =========================================================

  app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    req.cookies = {};

    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');

        if (name && value) {
          req.cookies[name] = decodeURIComponent(value);
        }
      });
    }

    next();
  });

  // =========================================================
  // Sessions
  // =========================================================

  const sessions = new Map();

  const DISCORD_API = 'https://discord.com/api/v10';

  // Administrator permission
  const ADMIN_PERMISSION = 0x8n;

  const OAUTH_SCOPES = ['identify', 'guilds'];

  // =========================================================
  // OAuth URL
  // =========================================================

  const getOAuthUrl = () => {
    const params = new URLSearchParams({
      client_id: config.CLIENT_ID,
      redirect_uri: config.REDIRECT_URI,
      response_type: 'code',
      scope: OAUTH_SCOPES.join(' ')
    });

    return `https://discord.com/oauth2/authorize?${params.toString()}`;
  };

  // =========================================================
  // Exchange OAuth Code
  // =========================================================

  const exchangeCode = async (code) => {
    const params = new URLSearchParams({
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.REDIRECT_URI
    });

    const response = await axios.post(
      `${DISCORD_API}/oauth2/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  };

  // =========================================================
  // Get Discord User
  // =========================================================

  const getDiscordUser = async (accessToken) => {
    const response = await axios.get(
      `${DISCORD_API}/users/@me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  };

  // =========================================================
  // Get User Guilds
  // =========================================================

  const getUserGuilds = async (accessToken) => {
    const response = await axios.get(
      `${DISCORD_API}/users/@me/guilds`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  };

  // =========================================================
  // Check Administrator Permission
  // =========================================================

  const isGuildAdmin = (permissions) => {
    try {
      if (permissions === undefined || permissions === null) {
        return false;
      }

      return (
        (BigInt(String(permissions)) & ADMIN_PERMISSION) ===
        ADMIN_PERMISSION
      );
    } catch (error) {
      console.error(
        `[AUTH] Invalid guild permissions: ${permissions}`,
        error.message
      );

      return false;
    }
  };

  // =========================================================
  // Authentication Middleware
  // =========================================================

  const requireAuth = (req, res, next) => {
    const token = req.cookies?.auth || req.query.auth;

    console.log(
      `[AUTH] Path: ${req.path}, Token: ${
        token
          ? token.substring(0, 10) + '...'
          : 'none'
      }`
    );

    if (token && sessions.has(token)) {
      req.user = sessions.get(token);
      req.authenticated = true;

      console.log(
        `[AUTH] Authenticated as ${req.user.username}`
      );

      return next();
    }

    console.log(
      `[AUTH] Not authenticated, redirecting to /login`
    );

    if (req.path.startsWith('/api/')) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    res.redirect('/login');
  };

  // =========================================================
  // Guild Admin Middleware
  // =========================================================

  const requireGuildAdmin = async (req, res, next) => {
    const guildId = req.params.guildId;
    const user = req.user;

    if (!user || !user.accessToken) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    try {
      const userGuilds =
        await getUserGuilds(
          user.accessToken
        );

      const guild =
        userGuilds.find(
          g => g.id === guildId
        );

      if (!guild) {
        return res.status(403).json({
          error:
            'You are not a member of this server'
        });
      }

      if (!isGuildAdmin(guild.permissions)) {
        return res.status(403).json({
          error:
            'You need Administrator permission to configure this server'
        });
      }

      req.guild = guild;

      next();

    } catch (error) {
      console.error(
        '[AUTH] Error checking guild permissions:',
        error.message
      );

      return res.status(500).json({
        error:
          'Failed to verify permissions'
      });
    }
  };

  // =========================================================
  // Start Dashboard Server
  // =========================================================

  const startServer = () => {
    app.listen(
      port,
      '0.0.0.0',
      () => {
        printSuccess(
          `Dashboard running on port ${port}`
        );

        printInfo(
          `OAuth Redirect URI: ${config.REDIRECT_URI}`
        );
      }
    );
  };

  // =========================================================
  // Pages
  // =========================================================

  app.get(
    '/',
    (req, res) => {
      res.sendFile(
        path.join(
          __dirname,
          'public',
          'landing.html'
        )
      );
    }
  );

  app.get(
    '/login',
    (req, res) => {
      res.sendFile(
        path.join(
          __dirname,
          'public',
          'login.html'
        )
      );
    }
  );

  // =========================================================
  // Discord OAuth Login
  // =========================================================

  app.get(
    '/auth/discord',
    (req, res) => {
      const authUrl =
        getOAuthUrl();

      console.log(
        `[OAUTH] Redirecting to Discord OAuth: ${authUrl}`
      );

      res.redirect(authUrl);
    }
  );

  // =========================================================
  // OAuth Callback
  // =========================================================

  app.get(
    '/auth/callback',
    async (req, res) => {
      const {
        code,
        error
      } = req.query;

      if (error) {
        console.log(
          `[OAUTH] Error from Discord: ${error}`
        );

        return res.redirect(
          '/login?error=discord_denied'
        );
      }

      if (!code) {
        console.log(
          `[OAUTH] No code received`
        );

        return res.redirect(
          '/login?error=no_code'
        );
      }

      try {
        console.log(
          `[OAUTH] Exchanging code for tokens...`
        );

        const tokens =
          await exchangeCode(code);

        console.log(
          `[OAUTH] Getting user info...`
        );

        const user =
          await getDiscordUser(
            tokens.access_token
          );

        console.log(
          `[OAUTH] Getting user guilds...`
        );

        const guilds =
          await getUserGuilds(
            tokens.access_token
          );

        // =====================================================
        // Debug OAuth Guilds
        // =====================================================

        console.log(
          `[OAUTH] Discord returned ${guilds.length} guild(s)`
        );

        guilds.forEach(
          guild => {
            console.log(
              `[OAUTH] Guild: ${guild.name} | ID: ${guild.id} | Permissions: ${guild.permissions} | Admin: ${isGuildAdmin(guild.permissions)}`
            );
          }
        );

        // =====================================================
        // Create Session
        // =====================================================

        const sessionToken =
          'session_' +
          Math.random()
            .toString(36)
            .substr(2, 16) +
          Date.now()
            .toString(36);

        const sessionData = {
          id: user.id,

          username:
            user.username,

          discriminator:
            user.discriminator,

          avatar:
            user.avatar,

          accessToken:
            tokens.access_token,

          refreshToken:
            tokens.refresh_token,

          guilds:
            guilds,

          loginTime:
            Date.now()
        };

        sessions.set(
          sessionToken,
          sessionData
        );

        console.log(
          `[OAUTH] Session created for ${user.username}#${user.discriminator}`
        );

        // =====================================================
        // Auth Cookie
        // =====================================================

        res.cookie(
          'auth',
          sessionToken,
          {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge:
              7 *
              24 *
              60 *
              60 *
              1000
          }
        );

        res.redirect(
          '/servers'
        );

      } catch (error) {
        console.error(
          '[OAUTH] Error:',
          error.response?.data ||
            error.message
        );

        res.redirect(
          '/login?error=oauth_failed'
        );
      }
    }
  );

  // =========================================================
  // Servers Page
  // =========================================================

  app.get(
    '/servers',
    requireAuth,
    (req, res) => {
      res.set(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      );

      res.sendFile(
        path.join(
          __dirname,
          'public',
          'servers.html'
        )
      );
    }
  );

  // =========================================================
  // Dashboard Page
  // =========================================================

  app.get(
    '/dashboard',
    requireAuth,
    (req, res) => {
      res.set(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      );

      res.set(
        'Pragma',
        'no-cache'
      );

      res.set(
        'Expires',
        '0'
      );

      res.sendFile(
        path.join(
          __dirname,
          'public',
          'index.html'
        )
      );
    }
  );

  // =========================================================
  // Static Files
  // =========================================================

  app.use(
    express.static(
      path.join(
        __dirname,
        'public'
      )
    )
  );

  // =========================================================
  // API - Current User
  // =========================================================

  app.get(
    '/api/user',
    requireAuth,
    (req, res) => {
      const user =
        req.user;

      res.json({
        id:
          user.id,

        username:
          user.username,

        discriminator:
          user.discriminator,

        avatar:
          user.avatar,

        avatarUrl:
          user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(
                user.discriminator || '0'
              ) % 5}.png`
      });
    }
  );

  // =========================================================
  // API - Servers
  // =========================================================

  app.get(
    '/api/servers',
    requireAuth,
    async (req, res) => {
      try {
        const userGuilds =
          await getUserGuilds(
            req.user.accessToken
          );

        console.log(
          '\n[DEBUG] Discord Guilds:'
        );

        console.log(
          `Total guilds returned: ${userGuilds.length}`
        );

        userGuilds.forEach(
          guild => {
            console.log(
              `  - ${guild.name}`
            );

            console.log(
              `    ID: ${guild.id}`
            );

            console.log(
              `    Permissions: ${guild.permissions}`
            );

            console.log(
              `    Administrator: ${isGuildAdmin(
                guild.permissions
              )}`
            );

            console.log(
              `    Owner: ${guild.owner}`
            );

            console.log('');
          }
        );

        const botGuildIds =
          new Set(
            client.guilds.cache.map(
              g => g.id
            )
          );

        console.log(
          `[DEBUG] Bot is currently in ${botGuildIds.size} guild(s)`
        );

        const adminGuilds =
          userGuilds
            .filter(
              guild => {
                const admin =
                  isGuildAdmin(
                    guild.permissions
                  );

                console.log(
                  `[DEBUG] Checking ${guild.name} (${guild.id}) => Admin: ${admin}`
                );

                return admin;
              }
            )
            .map(
              guild => {
                const botGuild =
                  client.guilds.cache.get(
                    guild.id
                  );

                return {
                  id:
                    guild.id,

                  name:
                    guild.name,

                  icon:
                    guild.icon,

                  iconUrl:
                    guild.icon
                      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                      : null,

                  botJoined:
                    botGuildIds.has(
                      guild.id
                    ),

                  memberCount:
                    botGuild
                      ? botGuild.memberCount
                      : null
                };
              }
            );

        console.log(
          `[DEBUG] Admin guilds found: ${adminGuilds.length}`
        );

        adminGuilds.forEach(
          guild => {
            console.log(
              `[DEBUG] Server available: ${guild.name} (${guild.id}) | Bot joined: ${guild.botJoined}`
            );
          }
        );

        res.json(
          adminGuilds
        );

      } catch (error) {
        console.error(
          '[API] Error fetching servers:',
          error.message
        );

        console.error(
          error.response?.data || ''
        );

        res.status(500).json({
          error:
            'Failed to fetch servers'
        });
      }
    }
  );

  // =========================================================
  // API - Config
  // =========================================================

  app.get(
    '/api/config',
    requireAuth,
    (req, res) => {
      const guildId =
        req.query.guildId;

      if (
        guildId &&
        client.guilds.cache.has(
          guildId
        )
      ) {
        return res.json({
          guildId
        });
      }

      res.json({
        guildId:
          null
      });
    }
  );

  // =========================================================
  // API - Manageable Guilds
  // =========================================================

  app.get(
    '/api/guilds',
    requireAuth,
    async (req, res) => {
      try {
        const userGuilds =
          await getUserGuilds(
            req.user.accessToken
          );

        const botGuildIds =
          new Set(
            client.guilds.cache.map(
              g => g.id
            )
          );

        const managableGuilds =
          userGuilds
            .filter(
              guild =>
                isGuildAdmin(
                  guild.permissions
                ) &&
                botGuildIds.has(
                  guild.id
                )
            )
            .map(
              guild => {
                const botGuild =
                  client.guilds.cache.get(
                    guild.id
                  );

                return {
                  id:
                    guild.id,

                  name:
                    botGuild
                      ? botGuild.name
                      : guild.name,

                  icon:
                    guild.icon,

                  iconUrl:
                    guild.icon
                      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                      : null
                };
              }
            );

        res.json(
          managableGuilds
        );

      } catch (error) {
        console.error(
          '[API] Error fetching guilds:',
          error.message
        );

        res.status(500).json({
          error:
            'Failed to fetch guilds'
        });
      }
    }
  );

  // =========================================================
  // API - Guild Channels
  // =========================================================

  app.get(
    '/api/guild/:guildId/channels',
    requireAuth,
    requireGuildAdmin,
    (req, res) => {
      const guild = client.guilds.cache.get(req.params.guildId);

      if (!guild) {
        return res.status(404).json({
          error: 'Bot is not in this server. Please add the bot first.'
        });
      }

      // Dashboard log destinations are intentionally limited to normal text channels.
      // Voice, stage, forum, category and thread channels are excluded.
      const seenNames = new Set();
      const channels = guild.channels.cache
        .filter(channel => {
          const isAllowedType = channel.type === 0 || channel.type === 5;
          if (!isAllowedType || !channel.name) return false;

          const key = channel.name.trim().toLowerCase();
          if (seenNames.has(key)) return false;
          seenNames.add(key);
          return true;
        })
        .sort((a, b) => a.rawPosition - b.rawPosition || a.name.localeCompare(b.name))
        .map(channel => ({
          id: channel.id,
          name: channel.name,
          type: channel.type
        }));

      res.json(channels);
    }
  );

  // =========================================================
  // API - Guild Settings GET
  // =========================================================

  app.get(
    '/api/guild/:guildId/settings',
    requireAuth,
    requireGuildAdmin,
    (req, res) => {
      const settings =
        getGuildSettings(
          req.params.guildId
        );

      res.json(
        settings
      );
    }
  );

  // =========================================================
  // API - Guild Settings POST
  // =========================================================

  app.post(
    '/api/guild/:guildId/settings',
    requireAuth,
    requireGuildAdmin,
    (req, res) => {
      updateGuildSettings(
        req.params.guildId,
        req.body
      );

      res.json({
        success:
          true
      });
    }
  );

  // =========================================================
  // API - Guild Info
  // =========================================================

  app.get(
    '/api/guild/:guildId/info',
    requireAuth,
    requireGuildAdmin,
    (req, res) => {
      const guild =
        client.guilds.cache.get(
          req.params.guildId
        );

      if (!guild) {
        return res.status(404).json({
          error:
            'Bot is not in this server'
        });
      }

      res.json({
        id:
          guild.id,

        name:
          guild.name,

        icon:
          guild.icon,

        iconUrl:
          guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : null,

        memberCount:
          guild.memberCount
      });
    }
  );

  // =========================================================
  // Logout
  // =========================================================

  app.get(
    '/api/logout',
    (req, res) => {
      const token =
        req.cookies?.auth;

      if (token) {
        sessions.delete(
          token
        );
      }

      res.clearCookie(
        'auth'
      );

      res.json({
        success:
          true
      });
    }
  );

  // =========================================================
  // OAuth Config
  // =========================================================

  app.get(
    '/api/oauth-config',
    (req, res) => {
      res.json({
        redirectUri:
          config.REDIRECT_URI,

        clientId:
          config.CLIENT_ID
      });
    }
  );

  // =========================================================
  // Start
  // =========================================================

  if (client.isReady()) {
    startServer();
  } else {
    client.once(
      'ready',
      startServer
    );
  }
};

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (AeroX Development )
    + for any queries reach out Community or DM me.
*/