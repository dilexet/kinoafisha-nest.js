import { registerAs } from '@nestjs/config';

export default registerAs('authorize', () => ({
    google: {
        clientID: '69673119115-kod3mti5q6tmhejfl4et0s24jca3mqe2.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3001/authorize/google/callback',
    },

    jwt: {
        accessSecret: 'jwt-access-secret-key',
        refreshSecret: 'jwt-refresh-secret-key',
        accessExpiresIn: '15m',
        refreshExpiresIn: '15d',
    },

    apiUrl: 'http://localhost:3001/authorize',
    clientUrl: 'http://localhost:3000',
}));