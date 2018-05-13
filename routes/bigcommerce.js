const passport = require('passport');
const router = require('express').Router();
const express = require('express'),

    config = require('node-bigcommerce'),
     bigCommerce = new config({
    clientId: '128ecf542a35ac5270a87dc740918404',
    secret: 'acbd18db4cc2f85cedef654fccc4a4d8',
    callback: 'https://myapplication.com/auth',
    responseType: 'json'
});

router.get('/bigcommerce', (req, res, next) => {
    try {

        const data = bigCommerce.verify(req.query['signed_payload']);
        res.render('integrations/welcome', { title: 'Welcome!', data: data });
        
    } catch (err) {
        next(err);
    }
});


router.get('/bigcommerce', passport.authenticate('bigcommercee', {
    scope: ['profile', 'store_v2_contentl, store_v2_content_read_only', 'store_content_checkout', ' store_v2_customers', 'store_v2_customers_login', 'store_v2_information', '	store_v2_marketing', 'store_v2_orders', 'store_v2_transactions_read_only', 'store_v2_products', 'store_themes_manage', 'store_cart']
}));



const logger = require('debug')('node-bigcommerce:bigcommerce'),
    crypto = require('crypto'),
    Request = require('./request');

class BigCommerce {
    constructor(config) {
        if (!config) throw new Error('Config missing. The config object is required to make any call to the BigCommerce API');

        this.config = config;
        this.apiVersion = this.config.apiVersion || 'v2';
    }

    verify(signedRequest) {
        if (!signedRequest) throw new Error('The signed request is required to verify the call.');

        const splitRequest = signedRequest.split('.');

        if (splitRequest.length < 2) {
            throw new Error('The signed request will come in two parts seperated by a .(full stop). this signed request contains less than 2 parts.');
        }

        const signature = new Buffer(splitRequest[1], 'base64').toString('utf8');
        const json = new Buffer(splitRequest[0], 'base64').toString('utf8');
        const data = JSON.parse(json);

        logger('JSON: ' + json);
        logger('Signature: ' + signature);

        const expected = crypto.createHmac('sha256', keys.bigcommerce.clientSecret)
            .update(json)
            .digest('hex');

        logger('Expected Signature: ' + expected);

        if (expected === signature) {
            logger('Signature is valid');
            return data;
        }

        throw new Error('Signature is invalid');
    }

    authorize(query) {
        if (!query) return Promise.reject(new Error('The URL query paramaters are required.'));

        const payload = {
            client_id: keys.bigcommerce.clientID,
            client_secret: keys.bigcommerce.clientSecret,
            redirect_uri: keys.bigcommerce.callback,
            grant_type: 'authorization_code',
            code: query.code,
            scope: query.scope,
            context: 'stores/xegfh'
        };

        const request = new Request('login.bigcommerce.com', { failOnLimitReached: this.config.failOnLimitReached });
        return request.run('post', '/oauth2/token', payload);
    }

    createAPIRequest() {
        const accept = this.config.responseType === 'xml' ? 'application/xml' : 'application/json';

        return new Request('api.bigcommerce.com', {
            headers: {
                Accept: accept,
                'X-Auth-Client': keys.bigcommerce.clientID,
                'X-Auth-Token': this.config.accessToken
            },
            failOnLimitReached: this.config.failOnLimitReached,
            agent: this.config.agent
        });
    }

    request(type, path, data) {
        if (!this.config.accessToken || !this.config.storeHash) {
            return Promise.reject(new Error('Get request error: the access token and store hash are required to call the BigCommerce API'));
        }

        const extension = this.config.responseType === 'xml' ? '.xml' : '';
        const version = this.apiVersion;

        const request = this.createAPIRequest();
        let fullPath = `/stores/${this.config.storeHash}/${version}`;
        if (version !== 'v3') {
            fullPath += path.replace(/(\?|$)/, extension + '$1');
        } else {
            fullPath += path;
        }

        return request.run(type, fullPath, data);
    }

    get(path) {
        return this.request('get', path);
    }

    post(path, data) {
        return this.request('post', path, data);
    }

    put(path, data) {
        return this.request('put', path, data);
    }

    delete(path) {
        return this.request('delete', path);
    }
}

module.exports = BigCommerce;
