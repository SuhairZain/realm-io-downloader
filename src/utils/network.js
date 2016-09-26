/**
 * Created by Suhair Zain on 9/26/16.
 */

import $ from 'jquery'

import {
    DefaultHandler,
    Parser
} from 'htmlparser'


const createErrorMessage = (message) => {
    return {
        status: 1,
        error: message
    }
};

const findMatchingElements = (parent, tag) => parent.filter((elem) => elem.name === tag);

export const fetchPage = (url, handler) => {
    console.log("Fetching " + url);
    $.getJSON("http://whateverorigin.org/get?url=" + encodeURIComponent(url) + "&callback=?", (data) => {
        console.log("Fetched");

        var parser = new Parser(handler);
        parser.parseComplete(data.contents);
    });
};

export const fetchInitialPage = (url, callback) => {
    const handler = new DefaultHandler(function (error, dom) {
        if (error)
            console.error(error);
        else {
            console.log("Parsed");

            const html = findMatchingElements(dom, "html");
            if(html.length === 0) {
                callback.onError(createErrorMessage("HTML not found"));
                return;
            }

            const body = findMatchingElements(html[0].children, "body");
            if(body.length === 0) {
                callback.onError(createErrorMessage("Body not found"));
                return;
            }

            const scripts = findMatchingElements(body[0].children, "script");
            if(scripts.length === 0) {
                callback.onError(createErrorMessage("No Scripts found"));
                return;
            }

            const matchingScripts = scripts
                .filter((script) => script.children)
                .filter((script) => script.children[0].data.trim().includes("setupVideo"));
            if(matchingScripts.length === 0) {
                callback.onError(createErrorMessage("No Video Setup script found"));
                return;
            }

            callback.onInitialParseSuccess("http:" + matchingScripts[0].children[0].data.trim().match(/(\/\/[^"]*)/)[1]);
        }
    });
    fetchPage(url, handler);
};

const getMeta = (element) => {
    if(element.name==="meta" && element.attribs && /videoUrl=([^&]*)/.exec(element.attribs.content)){
        return element.attribs.content.match(/videoUrl=([^&]*)/)[1]
    }
    else if(element.children) {
        const count = element.children.length;
        for(var i = 0; i < count ; ++i){
            const meta = getMeta(element.children[i]);
            if(meta){
                return meta;
            }
        }
    }
    else {
        return null
    }
};

export const fetchVideoPage = (url, callback) => {
    const handler = new DefaultHandler(function (error, dom) {
        if (error)
            console.error(error);
        else {
            console.log("Parsed");

            const html = findMatchingElements(dom, "html");
            if(html.length === 0) {
                callback.onError(createErrorMessage("HTML not found"));
                return;
            }

            const body = findMatchingElements(html[0].children, "body");
            if(body.length === 0) {
                callback.onError(createErrorMessage("Body not found"));
                return;
            }

            const meta = getMeta(body[0]);
            if(meta.length === 0) {
                callback.onError(createErrorMessage("No meta found"));
                return;
            }

            callback.onVideoPageSuccess(meta);
        }
    });
    fetchPage(url, handler);
};

export const parseJsonData = (url, callback) => {
    $.getJSON(url, (data) => {
        callback.onJsonParseSuccess(data.chapters[0].video.url);
    })
};