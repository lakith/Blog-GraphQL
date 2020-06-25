const users = [
    {
        id: '1',
        name: 'Lakith Muthugala',
        email: 'lakith1995@gmail.com',
        age: 23
    },
    {
        id: '2',
        name: 'Hansi Yapa',
        email: 'hansi@gmail.com',
        age: 23
    },
    {
        id: '3',
        name: 'Sudeep',
        email: 'sudeep@gmail.com',
        age: 50
    }
]

const posts = [
    {
        id: '1',
        title: 'graphQL',
        body: 'This is a graphQL post',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'socketIO',
        body: 'This is a socketIO post',
        published: true,
        author: '2'
    },
    {
        id: '3',
        title: 'nginX',
        body: 'This is a nginX post',
        published: false,
        author: '3'
    },
]

const comments = [
    {
        id: '1',
        text: 'This is a awsome post.',
        owner: '2',
        post: '1'
    },
    {
        id: '2',
        text: 'Super Post.',
        owner: '1',
        post: '3'
    },
    {
        id: '3',
        text: 'Thanks for sharing this.',
        owner: '3',
        post: '1'
    },
    {
        id: '4',
        text: 'Clear steps, easy to fallow',
        owner: '3',
        post: '2'
    }
]

const db = {
    users,
    posts,
    comments
}

export default db