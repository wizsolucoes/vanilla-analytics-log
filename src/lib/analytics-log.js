
import { HttpConnector } from './http-connector';

export class AnalyticsLog {

    constructor(config) {
        this.apiPath = config.apiPath;
        this.sistema = config.sistema;
        this.chave = config.chave;
        this.id = config.userId;
        this.tipo = config.tipoId;
    }

    _getBrowser() {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: 'IE', version: (tem[1] || '') };
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR|Edge\/(\d+)/)
            if (tem != null) { return { name: 'Opera', version: tem[1] }; }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
        return {
            name: M[0],
            version: M[1]
        };
    }

    _post(_data, _extraData) {

        var _browser = this._getBrowser();
        var __data = {
            id: this.id,
            tipo: this.tipo,
            sistema: this.sistema,
            chave: this.chave,
            evento: _data.type,
            dados: Object.assign({
                browserName: _browser.name,
                browserVersion: _browser.version,
                userAgent: navigator.userAgent,
                timeStamp: new Date().getTime()
            }, _data)
            
        };

        if (_extraData)
            __data = Object.assign(__data, _extraData);

        new HttpConnector(this.ssoTimeout)
            .request(
                'post',
                `${this.apiPath}`,
                'application/json',
                __data
            ).then(_ => { }, _ => { });

    }

    sendPageView(_page, _extraData = null) {
        this._post({ 'page': _page, 'action': 'view', 'type': "pageview" }, _extraData);
    }

    sendAction(_page, _action, _describe, _extraData = null) {
        this._post({ 'page': _page, 'action': _action, 'type': "action", 'description': _describe }, _extraData);
    }

}