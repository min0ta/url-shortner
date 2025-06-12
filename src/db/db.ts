import { Pool } from "pg"
import { Config, config } from "src/config/config"
import { Analytics, User, nullUser } from "./models"

class Database {
    pool: Pool
    constructor(config: Config) {
        this.pool = new Pool({
            host: config.DB_HOST,
            password: config.DB_PASSWORD,
            user: config.DB_USER,
            database: config.DB_NAME,
            port: config.DB_PORT,
        })
    }
    async getUserByEmail(email: string): Promise<User | 0> {
        const q = await this.pool.query(`SELECT id, email, pwd FROM users WHERE email = $1`, [email])
        
        if (q.rowCount == 0)
            return nullUser
        const row = q.rows[0]
        return {
            id: row['id'],
            password: row['pwd'],
            email: row['email'],
        }
    }
    async createUser(user: User): Promise<number> {
        const q = await this.pool.query(`INSERT INTO users(email, pwd) VALUES ($1, $2) RETURNING id`, [user.email, user.password])
        return q.rows[0]
    }

    async getLink(alias: string) {
        const result = await this.pool.query(`
                SELECT original_url, id, user_id FROM short_urls WHERE short_code = $1
            `, [alias])
        return {original_url: result.rows[0].original_url as string, id: result.rows[0].id as number, user_id: result.rows[0].user_id as number}
    }
    async insertLink(original_url: string, short_code: string, user_id?: number): Promise<number> {
        const result = await this.pool.query(`
            INSERT INTO short_urls (original_url, short_code, user_id) VALUES ($1, $2, $3) RETURNING id;
        `, [original_url, short_code, user_id])
        return result.rows[0].id
    }

    async insertClick(url_id: number, referer: string, user_agent: string, ip_hash: string): Promise<number> {
        const result = await this.pool.query(`INSERT INTO clicks (url_id, user_agent, referer, ip_hash) VALUES ($1, $2, $3, $4) RETURNING id`, [url_id, user_agent, referer, ip_hash])
        return result.rows[0].id
    }
    async getClicks(short_code: string): Promise<Analytics[]> {
        const result = await this.pool.query(
            `SELECT 
            COUNT(*) as total_clicks,
            DATE(click_time) as date,
            COUNT(DISTINCT ip_hash) as unique_visitors
           FROM clicks
           JOIN short_urls ON clicks.url_id = short_urls.id
           WHERE short_urls.short_code = $1
           GROUP BY DATE(click_time)
           ORDER BY date`,
            [short_code],
          );
        return result.rows
    }

    async getAllLinks(id: number) {
        const result = await this.pool.query(`SELECT id, short_code, original_url, created FROM short_urls WHERE user_id = $1`, [id])
        return result.rows
    }
}

export const db = new Database(config)