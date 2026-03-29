export interface TextAliveTokenRepository {
    getToken(): Promise<string>;
}