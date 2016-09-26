/**
 * Created by Suhair Zain on 4/6/16.
 */

import React, {Component} from 'react';

import {
    fetchInitialPage,
    fetchVideoPage,
    parseJsonData
} from './utils/network'

class App extends React.Component {
    styles = {
        root: {
            alignItems: 'center',
            backgroundColor: '#f44336',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            width: '100%'
        },
        content: {
            display: 'flex',
            width: '80%'
        },
        title: {
            color: '#fff',
            fontSize: '2em',
            margin: '36px 0'
        },
        input: {
            width: '100%'
        },
        button: {
            backgroundColor: '#fff',
            cursor: 'pointer',
            marginLeft: 8,
            padding: '4px 8px'
        },
        result: {
            color: 'rgba(255, 255, 255, 0.6)',
            margin: '24px 0'
        },
        video: {
            color: '#fff',
            textDecoration: 'none'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            url: "https://realm.io/news/360andev-chris-guzman-android-libraries-beginner/",
            result: "Enter url of the video and click Fetch"
        }
    }

    onError = (error) => {
        this.setState({
            ...this.state,
            result: "An error occurred - " + error.error
        })
    };

    onInitialParseSuccess = (link) => {
        parseJsonData(link, this);
        this.setState({
            ...this.state,
            result: "JSON Metadata obtained. Please wait."
        })
    };

    onJsonParseSuccess = (link) => {
        fetchVideoPage(link, this);
        this.setState({
            ...this.state,
            result: "Loading video page. Please wait."
        })
    };

    onVideoPageSuccess = (link) => {
        this.setState({
            ...this.state,
            result: "Video link obtained",
            video: link
        })
    };

    fetchInitial = () => {
        fetchInitialPage(this.state.url, this);
        this.setState({
            ...this.state,
            result: "Loading main page. Please Wait."
        })
    };

    onUrlChange = (e) => {
        this.setState({
            ...this.state,
            url: e.target.value
        })
    };

    render() {
        return (
            <div style={this.styles.root}>
                <span style={this.styles.title}>Realm.io Video Downloader</span>
                <div style={this.styles.content}>
                    <input
                        style={this.styles.input}
                        value={this.state.url}
                        onChange={this.onUrlChange}/>
                    <div style={this.styles.button} onClick={this.fetchInitial}>FETCH</div>
                </div>
                <span style={this.styles.result}>{this.state.result}</span>
                {this.state.video ? <a href={this.state.video} style={this.styles.video}>Click Here to download. Rename it to .mp4 to play.</a> : null }
            </div>
        );
    }
}

export default App;
