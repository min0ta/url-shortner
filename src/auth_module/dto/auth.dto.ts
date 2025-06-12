export class LoginRequest {
    email: string
    password: string
}

export class LoginResponse {
    error?: string
    code: number
}

export class RegisterRequest {
    email: string
    password: string
}

export class RegisterResponse {
    error?: string
    code: number
}

export const errors = {
    Unknown: 'unknown error',
    InvalidData: 'invalid data'
}