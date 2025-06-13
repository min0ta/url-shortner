class Web {
    server = "http://localhost:3000/"

    async post(path, body = {}) {
        const q = await fetch(`${this.server}${path}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({'content-type': 'application/json'}),
        })
        return this.#throwError(q.json());
    }
    async get(path) {
        const q = await fetch(`${this.server}${path}`)
        return this.#throwError(q.json());
    }
    async put(path, body = {}) {
        const q = await fetch(`${this.server}${path}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: new Headers({'content-type': 'application/json'}),
        })
        return this.#throwError(q.json());
    }
    async delete(path) {
        const q = await fetch(`${this.server}${path}`, {
            method: "DELETE",
        })
        return this.#throwError(q.json());
    }
    #throwError(q) {
        if (q == null) {
            return q
        }
        if (q.error != null) {
            throw q.error
        }
        return q
    }
    static errors = {
        NotLoggedIn: 'you are not logged in'
    }
}

const web = new Web()

const api = {
    register: async (email, password) => {
        const q = await web.post("auth/register", {email, password})
        console.log(q)
        return q;
    },
    login: async (email, password) => {
        const q = await web.post("auth/login", {email, password})
        console.log(q)
        return q;
    },
    logout: async () => {
        return web.post("auth/logout")
    },

    createLink: async (originalUrl) => {
        const a = await web.post("link", {
            original_url: originalUrl
        })
        console.log(a)
        return a
    },
    getAllLinks: async () => {
        const a = await web.get('link')
        console.log(a)
        return a
    },

    getLinkStats: async (linkCode) => {
        const a = await web.get(`analytics/${linkCode}`)
        console.log(a)
        return a
        
    }

};
