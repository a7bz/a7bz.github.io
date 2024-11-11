export function preWrapperPlugin(md, options) {
    const fence = md.renderer.rules.fence;
    md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args;
        const token = tokens[idx];
        token.info = token.info.replace(/\[.*\]/, '');
        const active = / active( |$)/.test(token.info) ? ' active' : '';
        token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ');
        const lang = extractLang(token.info);
        return (
            `<div class="language-${lang}${getAdaptiveThemeMarker(options)}${active}">` +
            `<button title="${options?.codeCopyButtonTitle}" class="copy"></button>` +
            `<span class="lang">${lang}</span>` +
            fence(...args) +
            '</div>'
        );
    };
}

export function getAdaptiveThemeMarker(options) {
    return options?.hasSingleTheme ? '' : ' vp-adaptive-theme';
}

export function extractTitle(info, html = false) {
    if (html) {
        return (
            info.replace(/<!--[^]*?-->/g, '').match(/data-title="(.*?)"/)?.[1] || ''
        );
    }
    return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt';
}

function extractLang(info) {
    return info
        .trim()
        .replace(/=(\d*)/, '')
        .replace(/:(no-)?line-numbers({| |$|=\d*).*/, '')
        .replace(/(-vue|{| ).*$/, '')
        .replace(/^vue-html$/, 'template')
        .replace(/^ansi$/, '');
}
