import sanitizeHtml from 'sanitize-html';

const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig;
const usernamePattern = /(?<=^|\s)@([\w.]+)(?<!\.)/gi;

// Sanitize all HTML tags and attributes
// and adding links to URLs
const safetySanitizeWithLinks = (str) => {
    // replace urls for <a> tags
    str = str.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');

    // replace usernames for <a> tags
    str = str.replace(usernamePattern, '<a href="https://t.me/$1">@$1</a>');

    // sanitize html
    str = sanitizeHtml(str, {
        allowedTags: ['a'],
        allowedAttributes: {
            'a': [ 'href', 'target' ]
        }
    });

    return str;
};



export { safetySanitizeWithLinks };
