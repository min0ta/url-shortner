export class Config {
    DB_HOST = "localhost"
    DB_PASSWORD = "root"
    DB_USER = "postgres"
    DB_NAME = "urlshortener"
    DB_PORT = 5432
    JWT_SIGING_KEY = "ANDTSDONTMAKENOSENSE"
    JWT_EXPIRES = 30*24*60
}

export const config = new Config()