!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/bundles/shopwarebtcpay/",n(n.s="W/6q")}({"9HF9":function(e){e.exports=JSON.parse('{"coincharge-btcpay-generate-key":{"button":"Generate API key","error":"Provided url isn\'t valid"},"coincharge-btcpay-test-connection":{"success":"Connection was successfully established","error":"Connection could not be established. Please check your API credentials","button":"Test connection"}}')},"W/6q":function(e,t,n){"use strict";n.r(t);var r=n("lE2+"),o=n.n(r),i=Shopware,c=i.Component,a=i.Mixin;c.register("coincharge-btcpay-generate-key",{template:o.a,inject:["coinchargeBtcpayApiService"],mixins:[a.getByName("notification")],data:function(){return{isLoading:!1}},methods:{generate:function(){var e=document.getElementById("ShopwareBTCPay.config.btcpayServerUrl").value,t=this.removeTrailingSlash(e);return this.isLoading=!0,window.open(t+"/api-keys/authorize/?applicationName=BTCPay%20Shopware%20plugin&permissions=btcpay.store.cancreateinvoice&permissions=btcpay.store.canviewinvoices&selectiveStores=true&redirect=http://localhost/store-api/btcpay/authorized","_blank")},removeTrailingSlash:function(e){return e.replace(/\/$/,"")}}});var s=n("irp2"),u=n.n(s),p=Shopware,l=p.Component,f=p.Mixin;function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return g(this,n)}}function g(e,t){if(t&&("object"===y(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}l.register("coincharge-btcpay-test-connection",{template:u.a,inject:["coinchargeBtcpayApiService"],mixins:[f.getByName("notification")],data:function(){return{isLoading:!1}},methods:{check:function(){var e=this;this.isLoading=!0,this.coinchargeBtcpayApiService.verifyApiKey().then((function(t){if(!1===t.success)return e.createNotificationWarning({title:"BTCPay Server",message:e.$tc("coincharge-btcpay-test-connection.error")}),void(e.isLoading=!1);e.createNotificationSuccess({title:"BTCPay Server",message:e.$tc("coincharge-btcpay-test-connection.success")}),e.isLoading=!1}))}}});var S=Shopware.Classes.ApiService,w=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&h(e,t)}(i,e);var t,n,r,o=v(i);function i(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"coincharge-btcpay";return d(this,i),o.call(this,e,t,n)}return t=i,(n=[{key:"verifyApiKey",value:function(){var e="".concat(this.getApiBasePath(),"/verify-api-key"),t=this.getBasicHeaders();return this.httpClient.post(e,{},{headers:t}).then((function(e){return S.handleResponse(e)}))}}])&&b(t.prototype,n),r&&b(t,r),Object.defineProperty(t,"prototype",{writable:!1}),i}(S),P=n("9HF9"),O=n("z6Wy"),j=Shopware.Application;j.addServiceProvider("coinchargeBtcpayApiService",(function(e){var t=j.getContainer("init");return new w(t.httpClient,e.loginService)})),Shopware.Locale.extend("de-DE",P),Shopware.Locale.extend("en-GB",O)},irp2:function(e,t){e.exports='<div>\n    <sw-button-process\n        :isLoading="isLoading"\n        @click="check"\n    >{{ $tc(\'coincharge-btcpay-test-connection.button\') }}</sw-button-process>\n</div>'},"lE2+":function(e,t){e.exports='<div>\n    <sw-button-process\n        :isLoading="isLoading"\n        @click="generate"\n    >{{ $tc(\'coincharge-btcpay-generate-key.button\') }}</sw-button-process>\n</div>'},z6Wy:function(e){e.exports=JSON.parse('{"coincharge-btcpay-generate-key":{"button":"Generate API key","error":"Provided url isn\'t valid"},"coincharge-btcpay-test-connection":{"success":"Connection was successfully established","error":"Connection could not be established. Please check your API credentials","button":"Test connection"}}')}});