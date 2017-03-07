import React, {Component} from 'react';
import {
    AppRegistry,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

let MOCKED_MOVIES_DATA = [
    {
        title: '标题',
        year: '2015',
        posters: {thumbnail: 'https://cdn.pixabay.com/photo/2017/01/07/20/38/portrait-1961529__340.jpg'}
    },
];

let host = 'http://localhost:3000'

// 样式
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    thumbnail: {
        width: 53,
        height: 81
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center'
    },
    year: {
        textAlign: 'center'
    }
});

export default class SimpleAppMovie extends Component {
    constructor(props) {
        console.log('constructor');
        super(props);
        // 初始化状态
        this.state = {
            movies: null
        };
        // // ES6中需要手动绑定this
        // this.getMoviesFromApi = this.getMoviesFromApi.bind(this);
    }

    componentDidMount() {
        this.getMoviesFromApi();
    }

    render() {
        var movie = MOCKED_MOVIES_DATA[0];
        return (
            <View style={styles.container}>
                <Image style={styles.thumbnail} source={{uri: movie.posters.thumbnail}}/>
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <Text style={styles.year}>{movie.year}</Text>
                </View>
            </View>
        );
    }

    // 从Api获取电影数据
    async getMoviesFromApi() {
        try {
            let response = await fetch(host + '/');
            let responseJson = await response.json();
            console.log('responseJson = ' + JSON.stringify(responseJson));
            return responseJson.movies;
        } catch (error) {
            console.error(error);
        }
    }
}

AppRegistry.registerComponent('SimpleAppMovie', () => SimpleAppMovie);
