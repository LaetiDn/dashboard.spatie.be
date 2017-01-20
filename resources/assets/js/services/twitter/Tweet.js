import { get } from 'lodash';
import moment from 'moment';

export default class {

    constructor(tweetProperties) {
        this.tweetProperties = tweetProperties;
    }

    get authorScreenName() {
        return '@' + this.tweetProperties['user']['screen_name'];
    }

    get authorName() {
        return this.tweetProperties['user']['name'];
    }

    get authorAvatar() {
        return this.tweetProperties['user']['profile_image_url_https'];
    }

    get image() {
        return get(this.tweetProperties, 'extended_entities.media[0].media_url_https', '');
    }

    get date() {
        return moment(this.tweetProperties['created_at'], 'dd MMM DD HH:mm:ss ZZ YYYY');
    }

    get text() {
        let text = this.tweetProperties['text'];

        if (this.tweetProperties.hasOwnProperty('display_text_range')) {
            text = text.substr(...this.tweetProperties['display_text_range']);
        }

        text = get(this.tweetProperties, 'extended_entities.media', [])
            .map(media => media.url)
            .reduce((text, mediaUrl) => text.replace(mediaUrl, ''), text);

        return text;
    }

    get html() {
        return this.text.replace(
            // http://stackoverflow.com/a/38383605/999733
            /(#\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/g, 
            '<span class="tweet__body__hashtag">$1</span>'
        );
    }

    get displayClass() {
        if (this.text.length < 40) {
            return 'default';
        }

        if (this.text.length < 140) {
            return 'medium';
        }

        return 'small';
    }
}