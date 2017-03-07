import React, {Component} from 'react';
import {
    AppRegistry,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

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
        this.getMoviesFromApi = this.getMoviesFromApi.bind(this);
    }

    // 真实DOM渲染之后被调用
    componentDidMount() {
        this.getMoviesFromApi();
    }

    /**
     * 渲染加载中视图
     * @return {XML}
     */
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>正在加载电影数据</Text>
            </View>
        );
    }

    /**
     * 渲染电影项
     * @param movie
     * @return {XML}
     */
    renderMovie(movie) {
        return (
            <View style={styles.container}>
                <Image style={styles.thumbnail} source={{uri: movie.imgThumbnail}}/>
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{movie.name}</Text>
                    <Text style={styles.year}>{movie.intro}</Text>
                </View>
            </View>
        );
    }

    // 渲染
    render() {
        console.log('render this.state.movies = ' + JSON.stringify(this.state.movies));
        if (!this.state.movies) {
            return this.renderLoadingView();
        }

        let movie = this.state.movies[0];
        console.log('movie = ' + JSON.stringify(movie));
        return this.renderMovie(movie);
    }

    // 从Api获取电影数据
    async getMoviesFromApi() {
        try {
            let response = await fetch(host + '/');
            let responseJson = await response.json();
            console.log('responseJson = ' + JSON.stringify(responseJson));
            this.setState({
                movies: responseJson.movies
            });
            return responseJson.movies;
        } catch (error) {
            console.error(error);
        }
    }

    // getMoviesFromApi() {
    //     fetch(host + '/')
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //             console.log(responseData);
    //             this.setState({
    //                 movies: responseData
    //             });
    //         });
    // }
}

AppRegistry.registerComponent('SimpleAppMovie', () => SimpleAppMovie);
