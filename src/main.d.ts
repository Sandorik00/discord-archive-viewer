export default interface message {
    channelID: string;
    id: string;
    type: 'DEFAULT' | 'GUILD_MEMBER_JOIN';
    system: boolean;
    content: string;
    authorID: string;
    pinned: boolean;
    embeds: [];
    attachments: [];
    createdTimestamp: number;
    editedTimestamp: number | null;
    reference: object | null;
    guildID: string;
    cleanContent: string;
}