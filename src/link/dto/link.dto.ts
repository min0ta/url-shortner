export type GetLinkResponse = {
    result?: string,
    error?: string,
    code: number
}

export class CreateLinkRequest {
    original_url: string
}

export const errors = {
    Unknown: 'unknown error',
    NoSuchLink: 'no such link',
    InvalidRequest: 'invalid request',
    Unauth: 'you are not logged id'
}