export const permissions: Array<string> = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
];

export const permissionsShowCase: Array<string> = [
    "Create Invite",
    "Kick Members",
    "Ban Members",
    "Administrator",
    "Manage Channels",
    "Manage Server",
    "Add Reactions",
    "View Audit Log",
    "Priority Speaker",
    "Video",
    "View Channels",
    "Send Messages",
    "Send Text-to-Speech Messages",
    "Manage Messages",
    "Embed Links",
    "Attach Files",
    "Read Message History",
    "Mention @everyone, @here, and All Roles",
    "Use External Emoji",
    "View Server Insights",
    "Connect",
    "Speak",
    "Mute Members",
    "Deafen Members",
    "Move Members",
    "Use Voice Activity",
    "Change Nickname",
    "Manage Nicknames",
    "Manage Roles",
    "Manage Webhooks",
    "Manage Emojis"
];

export const validEvents = [
    'channelCreate',
    'channelDelete',
    'guildBanRemove',
    'guildUnavailable',
    'guildDelete',
    'emojiCreate',
    'emojiDelete',
    'emojiUpdate',
    'guildIntegrationsUpdate',
    'guildMemberRemove',
    'guildMemberUpdate',
    'guildMemberAvailable',
    'roleCreate',
    'roleDelete',
    'roleUpdate',
    'guildUpdate',
    'inviteCreate',
    'inviteDelete',
    'message',
    'messageDelete',
    'messageDeleteBulk',
    'messageReactionAdd',
    'messageReactionRemove',
    'messageReactionRemoveAll',
    'messageReactionRemoveEmoji',
    'presenceUpdate',
    'typingStart',
    'userUpdate',
    'voiceStateUpdate',
    'webhookUpdate',
    'warn',
    'debug',
    'guildMemberSpeaking',
    'channelPinsUpdate',
    'channelUpdate',
    'guildBanAdd',
    'guildCreate',
    'guildMemberAdd',
    'guildMembersChunk',
    'messageUpdate',
    'shardResume',
    'shardReady',
    'shardDisconnect',
    'shardReconnecting',
    'invalidated',
    'shardError',
    'rateLimit',
    'error',
    'modMail'
];

export const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
};

export function getNumber(probabilities) {
    var rnd = Math.random();
    var total = 0;
    var hit;
    for (var i = 0; i < probabilities.length; i++) {
        if (rnd > total && rnd < total + probabilities[i][0]) {
            hit = probabilities[i];
        };
        total += probabilities[i][0];
    };
    return Number((hit[1] + (Math.random() * (hit[2] - hit[1]))).toFixed(2));
};

var number = getNumber([
    //CHANCE, MIN, MAX
    [0.35, 0],
    [0.2, 11, 20],
    [0.3, 21, 30],
    [0.1, 31, 35]
]);