// libraries
import request from "supertest";
import randomWords from 'random-words';
import utils from '.';
import app from "..";

class Login {
    constructor() {
        this.role = randomWords();
        this.user = { email: `${randomWords()}@test.test`, password: `Abcdefg42!`, roles: [this.role] };
        this.methods = [
            `GET`,
            `POST`,
            `PUT`,
            `DELETE`
        ];
    }

    /**
     * Token setter
     */
    async setToken() {
        this._createRole();
        this._createUser();

        this.token = this._login();
    }

    /**
     * Token getter
     */
    async getToken() {
        return this.token;
    }

    /**
     * Destroy temp
     */
    async destroyToken() {
        await this._destroyRole();
        
        return await this._destroyUser();
    }

    /**
     * Creates a temp role for testing.
     */
    async _createRole() {
        const e = await utils.loadCasbin();

        for (const method of this.methods) {
            const p = [this.role, '/*', method];
            await e.addPolicy(...p);
        }
    }
    
    /**
     * Destroys the temp testing role.
     */
    async _destroyRole() {
        const e = await utils.loadCasbin();
    
        for (const method of this.methods) {
            const p = [this.role, '/*', method];
            await e.removePolicy(...p);
        }
    }
    
    /**
     * Creates a temp user for testing.
     */
    async _createUser() {
        await request(app)
            .post('/user')
            .send(this.user)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200);
    }
    
    /**
     * Destroys temp testing user.
     */
    async _destroyUser() {
        const response = await request(app)
            .delete(`/user/${this.user.email}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200);
            
        return response.text;
    }
    
    /**
     * Login to the API to get a JWT token.
     */
    async _login() {
        const response = await request(app)
            .post('/user/login')
            .send(this.user)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200);

        return response.text;
    };
}

exports.Login = Login;
