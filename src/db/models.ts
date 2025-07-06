export const nullUser = 0

export type User = {
    id: number
    email: string
    password: string
}

export type Analytics = {
    total_clicks: number,
    date: Date,
    unique_visitors: number
}

export type Link = {
    original_url: string,
    id: number,
    user_id: number
}