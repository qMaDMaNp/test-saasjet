function filterHandler() {
    let filter = document.querySelector('#filter');
    let filterForm = document.querySelector('#filter-form');

    filter.addEventListener('change', (e) => {
        sendAction('change:filter?' + filter.value);
        filter.value === 'default' ? location.href = location.origin : filterForm.submit();
    });
}

function clickController() {
    let items = ['a'];

    is_touch_device()
        ? document.addEventListener('touchend', e => clickHandler(e))
        : document.addEventListener('mouseup', e => clickHandler(e));

    function clickHandler(e) {
        if (items.indexOf(e.target.tagName.toLowerCase()) >= 0)
            sendAction('click:link?' + e.target.href);
    }
}

function sendAction(action) {
    axios({
        method: 'post',
        url: '/action',
        data: {
            action: action
        }
    });
}

function is_touch_device() {
    let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    let mq = function(query) {
        return window.matchMedia(query).matches;
    };

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

document.addEventListener("DOMContentLoaded", (e) => {
    filterHandler();
    clickController();
});