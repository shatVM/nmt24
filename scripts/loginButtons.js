import * as importConfig from "./dev/config.js";

let googleURI = encodeURI(`${importConfig.api_url}/v1/auth/google`)
let discordURI = encodeURI(`https://discord.com/oauth2/authorize?client_id=1238104668266299462&response_type=code&redirect_uri=${importConfig.api_url}/v1/auth/discord&scope=identify+email`)
let githubURI = encodeURI(`https://github.com/login/oauth/authorize?client_id=Ov23li2iENFpM2jD4ndn&scope=user`)



let buttonsHtml = `<div id="g_id_onload" data-client_id="781332895690-mt2k88vbmt8pomoojg5nrup8cvtm4t09.apps.googleusercontent.com"
    data-context="signin" data-ux_mode="popup"
    data-login_uri="${googleURI}" data-auto_prompt="false">
  </div>

  <div class="g_id_signin" data-type="standard" data-shape="rectangular" data-theme="outline"
    data-text="signin_with" data-size="large" data-locale="uk" data-logo_alignment="center" data-width="400">
  </div>
  <div
    onclick="location.href='${discordURI}';"
    class="discord-button"><img src="img/discord-logo.svg" alt="ds logo"> Вхід через Discord</div>
    <div
    onclick="location.href='${githubURI}';"
    class="discord-button github"><img src="img/github-logo.svg" alt="ds logo"> Вхід через Github</div>`

document.getElementById("loginButtons").innerHTML = buttonsHtml;