const model = require('./model');
const db = require('../database/knex');

module.exports = {
    index: (request, response) => {
        let payload = {
            assignees: [],
            filterId: request.query.filter || '',
        };

        let promiseData = {
            issues: model.getAllIssues,
            statuses: model.getStatuses,
            priorities: model.getPriorities,
            types: model.getTypes,
            assignableUsers: model.getAssignableUsers,
            filters: model.getFilters,
        };

        if (request.query.hasOwnProperty('filter') && payload.filterId)
            promiseData.issues = (() => model.getFilterIssues(payload.filterId));

        Promise.all(Object.values(promiseData).map(value => (typeof value === 'function') && value()))
            .then(res => {
                Object.keys(promiseData).forEach((key, index) => payload[key] = res[index]);

                payload.assignees = formatUsers(payload.assignableUsers, payload.issues.issues);

                response.render('index', payload);
            })
            .catch(err => {
                console.error(err);
                db.insert(err);
            });
    },

    action: (request, response) => {
        let data = '';

        request.on('data', d => data += d);
        request.on('end', () => {
            db.insert(data, true);
        });
    },
};

function formatUsers(users, issues) {
    let assignee = [], userObj = {};

    users.forEach(user => {
        userObj = {
            name: user.displayName,
            issues: []
        };

        issues.forEach(issue => {
            if (issue.fields.assignee && issue.fields.assignee.displayName === user.displayName)
                userObj.issues.push(issue);
        });

        userObj.issues = formatIssues(userObj.issues);

        assignee.push(userObj);
    });

    return assignee;
}

function formatIssues(data) {
    let issues = [], countedIssues = [], checkProperties = [], currentIssue = {};

    data.forEach(issue => {
        issues.push({
            status: issue.fields.status.name,
            type: issue.fields.issuetype.name,
            priority: issue.fields.priority.name,
            createdDateComparison: daysBetween(new Date(issue.fields.created), new Date()) > 5,
            dueDateComparison: issue.fields.duedate && daysBetween(new Date(issue.fields.duedate), new Date()) > 3,
            link: `https://medifman.atlassian.net/issues/?jql=assignee="${issue.fields.assignee.displayName}" AND status="${issue.fields.status.name}" ORDER BY type asc, priority desc`
        })
    });

    for (let i = 0; i < issues.length; i++) {
        currentIssue = issues[i];
        if (checkProperties.indexOf(`${currentIssue.status},${currentIssue.type},${currentIssue.priority}`) >= 0) continue;

        issues.forEach(comparedIssue => {
            if ((currentIssue.status === comparedIssue.status) && (currentIssue.type === comparedIssue.type) && (currentIssue.priority === comparedIssue.priority))
                currentIssue.count = (currentIssue.count || 0) + 1;
        });

        checkProperties.push(`${currentIssue.status},${currentIssue.type},${currentIssue.priority}`);
        countedIssues.push(currentIssue);
    }

    return countedIssues;
}

function daysBetween(startDate, endDate) {
    let millisecondsPerDay = 24 * 60 * 60 * 1000;
    let toUTC = date => {
        let utcDate = new Date(date);
        utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
        return utcDate;
    };

    return Math.floor((toUTC(endDate) - toUTC(startDate)) / millisecondsPerDay);
}