require('dotenv').config();

describe(`\n   Env Values`, () => {
    it('Should be able to return a client ID', () => {
        const client = process.env.REACT_APP_GH_BASIC_CLIENT_ID;
        expect(client).toHaveLength(20);
    })
    it('Should be able to return a secret ID', () => {
        const secret = process.env.REACT_APP_GH_BASIC_SECRET_ID;
        expect(secret).toHaveLength(40);
    })
    it('Should be able to return a state', () => {
        const state = process.env.REACT_APP_STATE;

        expect(state).not.toEqual("");
        expect(state).toBeDefined();
        expect(state).not.toBeNull();
    })
    it('Should be able to return a backend url', () => {
        const url = process.env.REACT_APP_URL_BACK;

        expect(url).not.toEqual("");
        expect(url).toBeDefined();
        expect(url).not.toBeNull();
    })
    it('Should be able to return a frontend url', () => {
        const url = process.env.REACT_APP_URL_FRONT;

        expect(url).not.toEqual("");
        expect(url).toBeDefined();
        expect(url).not.toBeNull();
    })
    it('Should be able to return a backend port', () => {
        const port = Number(process.env.REACT_APP_PORT_BACK);

        expect(port).not.toEqual("");
        expect(port).toBeDefined();
        expect(port).not.toBeNull();
        expect(port).not.toBeNaN();
    })
    it('Should be able to return a frontend port', () => {
        const port = Number(process.env.REACT_APP_PORT_FRONT);

        expect(port).not.toEqual("");
        expect(port).toBeDefined();
        expect(port).not.toBeNull();
        expect(port).not.toBeNaN();
    })
    it('Should be able to return a db identity', () => {
        const db_identity = process.env.REACT_APP_DB_IDENTITY;

        expect(db_identity).not.toEqual("");
        expect(db_identity).toBeDefined();
        expect(db_identity).not.toBeNull();
    })
});
