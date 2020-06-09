const https = require('https');
const project = 'TH228322';
const host = 'medifman.atlassian.net';
const token = 'medifman@gmail.com:zdIkeMW1QhRHyBBpKOw9B1A2';
const encodedString = Buffer.from(token).toString('base64');

module.exports = {
    getAllIssues: () => {
        return new Promise((resolve, reject) => {
            const options = {
                host: host,
                path: `/rest/api/3/search?jql=project=${project}`,
                contentType: 'application/json',
                headers: {
                    'Authorization': `Basic ${encodedString}`
                },
                method: 'GET'
            };

            https.request(options, (res) => {
                let data = '';

                res.on('data', d => data += d);
                res.on('end', () => resolve(JSON.parse(data)));
            })
                .on('error', e => {
                    reject(e)
                })
                .end();
        });
    },

    getStatuses: () => {
        return new Promise((resolve, reject) => {
            const options = {
                host: host,
                path: `/rest/api/3/project/${project}/statuses`,
                contentType: 'application/json',
                headers: {
                    'Authorization': `Basic ${encodedString}`
                },
                method: 'GET'
            };

            https.request(options, (res) => {
                let data = '', statuses = [];

                res.on('data', d => data += d);
                res.on('end', () => {
                    statuses = JSON.parse(data)[0].statuses.map(x => x.name);
                    resolve(statuses)
                });
            })
                .on('error', e => {
                    reject(e)
                })
                .end();
        })
    },

    getPriorities: () => {
        return new Promise((resolve, reject) => {
            const options = {
                host: host,
                path: '/rest/api/3/priority',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Basic ${encodedString}`
                },
                method: 'GET'
            };

            https.request(options, (res) => {
                let data = '';

                res.on('data', d => data += d);
                res.on('end', () => resolve(JSON.parse(data)));
            })
                .on('error', e => {
                    reject(e)
                })
                .end();
        })
    },

    getTypes: () => {
        return new Promise((resolve, reject) => {
            const options = {
                host: host,
                path: '/rest/api/3/issuetype',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Basic ${encodedString}`
                },
                method: 'GET'
            };

            https.request(options, (res) => {
                let data = '', types = [];

                res.on('data', d => data += d);
                res.on('end', () => {
                    types = (() => {
                        let uniqueArray = [], arr = [];

                        JSON.parse(data).forEach(x => {
                            if (uniqueArray.indexOf(x.name) < 0) {
                                uniqueArray.push(x.name);
                                arr.push(x);
                            }
                        });

                        return arr;
                    })();

                    resolve(types)
                });
            })
                .on('error', e => {
                    reject(e)
                })
                .end();
        })
    },

    getAssignableUsers: () => {
        return new Promise((resolve, reject) => {
            const options = {
                host: host,
                path: `/rest/api/3/user/assignable/search?project=${project}`,
                contentType: 'application/json',
                headers: {
                    'Authorization': `Basic ${encodedString}`
                },
                method: 'GET'
            };

            https.request(options, (res) => {
                let data = '';

                res.on('data', d => data += d);
                res.on('end', () => resolve(JSON.parse(data)));
            })
                .on('error', e => {
                    reject(e)
                })
                .end();
        })
    },

    getFilters: () => {
        return new Promise((resolve, reject) => {
            const options = {
                host: host,
                path: '/rest/api/3/filter/search',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Basic ${encodedString}`
                },
                method: 'GET'
            };

            https.request(options, (res) => {
                let data = '', filters = [];

                res.on('data', d => data += d);
                res.on('end', () => {
                    filters = JSON.parse(data).values;
                    resolve(filters)
                });
            })
                .on('error', e => {
                    reject(e)
                })
                .end();
        })
    },

    getFilterIssues: (id) => {
        return getFilter(id)
            .then(data => {
                return new Promise((resolve, reject) => {
                    const options = {
                        host: host,
                        path: data.searchUrl.split('/rest')[1].replace (/^/,'/rest'),
                        contentType: 'application/json',
                        headers: {
                            'Authorization': `Basic ${encodedString}`
                        },
                        method: 'GET'
                    };

                    https.request(options, (res) => {
                        let data = '';

                        res.on('data', d => data += d);
                        res.on('end', () => { resolve(JSON.parse(data)) });
                    })
                        .on('error', e => {
                            reject(e)
                        })
                        .end();
                })
            })
            .catch(err => console.error(err));

        function getFilter(id) {
            return new Promise((resolve, reject) => {
                const options = {
                    host: host,
                    path: `/rest/api/3/filter/${id}`,
                    contentType: 'application/json',
                    headers: {
                        'Authorization': `Basic ${encodedString}`
                    },
                    method: 'GET'
                };

                https.request(options, (res) => {
                    let data = '';

                    res.on('data', d => data += d);
                    res.on('end', () => resolve(JSON.parse(data)));
                })
                    .on('error', e => {
                        reject(e)
                    })
                    .end();
            })
        };
    },
};