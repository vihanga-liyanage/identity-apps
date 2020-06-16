<!--
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
-->

<%= htmlWebpackPlugin.options.importUtil %>
<%= htmlWebpackPlugin.options.importTenantPrefix %>
<%= htmlWebpackPlugin.options.importSuperTenantvarant %>

<!DOCTYPE HTML>
<html>
    <head>
        <%= htmlWebpackPlugin.options.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="referrer" content="no-referrer" />

        <link href="<%= htmlWebpackPlugin.options.publicPath %>/libs/themes/default/theme.min.css" rel="stylesheet" type="text/css"/>

        <title><%= htmlWebpackPlugin.options.title %></title>

        <script src="<%= htmlWebpackPlugin.options.publicPath %>/app-utils.js"></script>
        <script>
            // When OAuth2 response mode is set to "form_post", Authorization code sent in a POST.
            // In such cases, the code is added to the sessionStorage under the key "code".
            var authorizationCode = "<%= htmlWebpackPlugin.options.authorizationCode %>";
            if (authorizationCode !== "null") {
                window.sessionStorage.setItem("code", authorizationCode);
            }

            var sessionState = "<%= htmlWebpackPlugin.options.sessionState %>";
            if (sessionState !== "null") {
                sessionStorage.setItem("session_state", sessionState);
            }

            if (window["AppUtils"] === null || window["AppUtils"].getConfig() === null) {
                AppUtils.init({
                    serverOrigin: "<%= htmlWebpackPlugin.options.serverUrl %>",
                    superTenant: "<%= htmlWebpackPlugin.options.superTenantvarant %>",
                    tenantPrefix: "<%= htmlWebpackPlugin.options.tenantPrefix %>"
                });
            }

            function getRandomPKCEChallenge() {
                var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz-_";
                var string_length = 43;
                var randomString = "";
                for (var i = 0; i < string_length; i++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    randomString += chars.substring(rnum, rnum + 1);
                }
                return randomString;
            }

            function sendPromptNoneRequest() {
                var rpIFrame = document.getElementById("rpIFrame");
                var promptNoneIFrame = rpIFrame.contentWindow.document.getElementById("promptNoneIFrame");
                var config = window.parent["AppUtils"].getConfig();
                promptNoneIFrame.src = sessionStorage.getItem("authorization_endpoint") +
                    "?response_type=code" +
                    "&client_id=" + config.clientID +
                    "&scope=openid" +
                    "&redirect_uri=" + config.loginCallbackURL +
                    "&state=Y2hlY2tTZXNzaW9u" +
                    "&prompt=none" +
                    "&code_challenge_method=S256&code_challenge=" + getRandomPKCEChallenge();
            }

            var config = window["AppUtils"].getConfig();

            var state = new URL(window.location.href).searchParams.get("state");
            if (state !== null && state === "Y2hlY2tTZXNzaW9u") {
                // Prompt none response.
                var code = new URL(window.location.href).searchParams.get("code");

                if (code !== null && code.length !== 0) {
                    var newSessionState = new URL(window.location.href).searchParams.get("session_state");

                    sessionStorage.setItem("session_state", newSessionState);

                    // Stop loading rest of the page inside the iFrame
                    if (navigator.appName === 'Microsoft Internet Explorer') {
                        document.execCommand("Stop");
                    } else {
                        window.stop();
                    }
                } else {
                    window.top.location.href = config.clientOrigin + config.appBaseWithTenant + config.routes.logout;
                }
            } else {
                // Tracking user interactions
                var IDLE_TIMEOUT = 600;
                if (config.session != null && config.session.userIdleTimeOut != null
                        && config.session.userIdleTimeOut > 1) {
                    IDLE_TIMEOUT = config.session.checkSessionInterval;
                }
                var IDLE_WARNING_TIMEOUT = 580;
                if (config.session != null && config.session.userIdleWarningTimeOut != null
                        && config.session.userIdleWarningTimeOut > 1) {
                    IDLE_WARNING_TIMEOUT = config.session.userIdleWarningTimeOut;
                }
                var SESSION_REFRESH_TIMEOUT = 300;
                if (config.session != null && config.session.sessionRefreshTimeOut != null
                        && config.session.sessionRefreshTimeOut > 1) {
                    SESSION_REFRESH_TIMEOUT = config.session.sessionRefreshTimeOut;
                }

                var _idleSecondsCounter = 0;
                var _sessionAgeCounter = 0;

                document.onclick = function () {
                    _idleSecondsCounter = 0;
                };
                document.onmousemove = function () {
                    _idleSecondsCounter = 0;
                };
                document.onkeypress = function () {
                    _idleSecondsCounter = 0;
                };

                window.setInterval(CheckIdleTime, 1000);

                function CheckIdleTime () {
                    _idleSecondsCounter++;
                    _sessionAgeCounter++;

                    // Logout user if idle
                    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
                        window.top.location.href = config.clientOriginWithTenant + config.appBaseWithTenant +
                            config.routes.logout;
                    } else if (_idleSecondsCounter === IDLE_WARNING_TIMEOUT) {
                        console.log("You will be logged out of the system after " +
                            (IDLE_TIMEOUT - IDLE_WARNING_TIMEOUT) + " seconds! Click OK to stay logged in.");
                    }

                    // Keep user session intact if the user is active
                    if (_sessionAgeCounter > SESSION_REFRESH_TIMEOUT) {
                        if (_sessionAgeCounter > _idleSecondsCounter) {
                            sendPromptNoneRequest();
                        }
                        _sessionAgeCounter = 0;
                    }
                }
            }

            var doNotDeleteApplications = ["Developer Portal", "User Portal"];
        </script>
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <iframe id="rpIFrame" src="/developer-portal/rpIFrame.html" frameborder="0" width="0" height="0"></iframe>
        <div id="root"></div>
    </body>
</html>
