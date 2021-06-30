export type TChannel = {
    id: number,
    name: string,
    type: string,
    position: number,
    category_id: string | null,
    topic: string | null,
    nsfw: boolean | null,
    discordID: string
}

export type TMessage = {
    id: number,
    channelID: string,
    authorID: string,
    messageID: string,
    content: string | null,
    embeds: string | null,
    attachments: string | null,
    reference: string | null,
    created_at: string
}

export type TMember = {
    id: number,
    discordID: string,
    name: string,
    bot: boolean,
    avatar_url: string
}