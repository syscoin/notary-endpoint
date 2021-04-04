
export {}
const request = require('supertest')
const app = require('../../app')

describe('Hello world', () => {
    it('should return Hello world message', (done) => {
        request(app)
            .get('/hello')
            .then(async (res: any) => {
                const body = res.body
                expect(body.message).toBe('Hello World')
                done()
            })
    })
})
