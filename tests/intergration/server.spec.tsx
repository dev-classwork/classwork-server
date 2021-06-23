import request from 'supertest';
import app from '../../src/app';
import connection from '../../src/database/connection';

require('dotenv').config();

describe(`\n   Database Config`, () => {
    it('Rollback', async() => {
        const rollback = await connection.migrate.rollback();
        expect(rollback[0]).toBeDefined();
    });

    it('Latest', async() => {
        const latest = await connection.migrate.latest();
        
        expect(latest).toEqual([
            1,
            [
              '0_create_user.ts',
              '1_create_class.ts',
              '2_create_teams.ts',
              '3_create_classes_teams.ts'
            ]
        ]);
    });
});

describe(`\n   User Routes`, () => {
    afterAll(async() => {
        await connection.destroy();
    });

    it('Should be able to create a new user', async() => {
        const response = await request(app)
        .post('/user/create').set({
            'auth': process.env.REACT_APP_DB_IDENTITY
        })
        .send({
            git_id: 0,
            id_auth: "Test",
            type: "Test",
            real_name: "Test",
            name: "Test",
            email: "Test@gmail.com",
            password: "Test",
            avatar: "Test",
            classes: [],
            urls: [],
            repos: [],
            teams: []
        });

        expect(response.body).toHaveProperty('git_id');
    });

    it('Should be able to list users', async() => {
        const response = await request(app)
        .get('/users').set({
            'auth': process.env.REACT_APP_DB_IDENTITY
        });

        expect(response.body).toEqual([{
            git_id: 0,
            id_auth: "Test",
            type: "Test",
            real_name: "Test",
            name: "Test",
            avatar: "Test",
            classes: [],
            urls: [],
            repos: [],
            teams: []
        }]);
    });
});