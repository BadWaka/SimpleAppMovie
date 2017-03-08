> GitHub：https://github.com/BadWaka/SimpleAppMovie

# 效果图

![](http://upload-images.jianshu.io/upload_images/1828354-5e396e9e567a39d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 使用的技术

### React Native

1. 组件Image、ListView、Text、View
2. 基本样式StyleSheet使用
3. ES6显示绑定this
![](http://upload-images.jianshu.io/upload_images/1828354-76196e24c55e4459.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4. ListView的简单使用
![](http://upload-images.jianshu.io/upload_images/1828354-5b03b2faf9fa709d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](http://upload-images.jianshu.io/upload_images/1828354-991cbf0208766917.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5. fetchApi和async、await简单使用
![](http://upload-images.jianshu.io/upload_images/1828354-cda08241076cece6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Node

1. request请求网络
![](http://upload-images.jianshu.io/upload_images/1828354-f58969cb9c054f24.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. cheerio操作DOM
![](http://upload-images.jianshu.io/upload_images/1828354-ca756668264f4950.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. express搭建接口

代码：
```
// index.ios.js
import React, {Component} from 'react';
import {
	AppRegistry,
	Image,
	ListView,
	StyleSheet,
	Text,
	View
} from 'react-native';

// host
let host = 'http://localhost:3000';

// 样式
const styles = StyleSheet.create({
	listView: {
		paddingTop: 20,
		backgroundColor: '#f5fcff'
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#f5fcff'
	},
	thumbnail: {
		width: 60,
		height: 100,
		marginRight: 16
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

	// 构造函数
	constructor(props) {
		console.log('constructor');
		super(props);
		// 初始化状态
		this.state = {
			dataSource: new ListView.DataSource({
				// 必须，如果两行数据不是同一个数据，返回true
				rowHasChanged: (row1, row2) => {
					return row1 !== row2;
				}
			}),
			loaded: false // 数据加载是否完成
		};
		// 给getMoviesFromApi显示绑定this，否则在getMoviesFromApi方法里，this就不能指向组件本身了
		this.getMoviesFromApi = this.getMoviesFromApi.bind(this);
	}

	// 首次渲染之前调用
	componentWillMount() {
		console.log('componentWillMount');
	}

	// 真实DOM渲染之后被调用
	componentDidMount() {
		console.log('componentDidMount');
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
				<Image style={styles.thumbnail} source={{
					uri: movie.imgThumbnail
				}}/>
				<View style={styles.rightContainer}>
					<Text style={styles.title}>{movie.name}</Text>
					<Text style={styles.year}>{movie.intro}</Text>
				</View>
			</View>
		);
	}

	// 渲染
	render() {
		console.log('render');
		// 如果数据没有加载完毕
		if (!this.state.loaded) {
			// 渲染加载中
			return this.renderLoadingView();
		}

		// 否则，渲染电影列表
		return <ListView dataSource={this.state.dataSource} renderRow={this.renderMovie} style={styles.listView}/>;
	}

	// 从Api获取电影数据
	async getMoviesFromApi() {
		try {
			let response = await fetch(host + '/'); // 发起请求
			let responseJson = await response.json(); // 获得数据
			console.log('responseJson = ' + JSON.stringify(responseJson));
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseJson.movies), // 把数据扔dataSource里
				loaded: true // 加载完成置为true
			});
			return responseJson.movies; // 返回电影数据
		} catch (error) {
			console.error(error);
		}
	}

	// Promise
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

// 注册App
AppRegistry.registerComponent('SimpleAppMovie', () => SimpleAppMovie);

```

Node
```
// server.js
/**
 * Created by BadWaka on 07/03/2017.
 */
const express = require('express');
const request = require('request'); // 引入异步请求库request
const cheerio = require('cheerio'); // 引入cheerio操作DOM

const app = express();

app.listen(3000, function () {
    console.log('listening 3000...');
});

app.get('/', function (req, res) {

    request('https://movie.douban.com/chart', function (err, response, body) {
        if (err) {
            console.error(err);
            return;
        }
        let movies = [];
        let $ = cheerio.load(body);
        let items = $('.indent .item');
        items.each(function (index, item) {
            let $item = $(item);
            let movie = {};
            movie.movieDetailHref = $item.find('.nbg').attr('href');  // 电影详情链接
            movie.imgThumbnail = $item.find('img').attr('src');   // 缩略图
            movie.name = $item.find('.pl2').find('a').text().replace(/\s/g, '');    // 电影名字
            movie.intro = $item.find('.pl2').find('.pl').text(); // 简介
            movie.rating = $item.find('.pl2').find('.rating_nums').text();  // 等级
            movie.evaluationCounts = $item.find('.pl2').children('.star').children('.pl').text(); // 评价人数
            movies.push(movie);
        });
        // console.log(movies);
        let data = {
            movies: movies
        };
        res.json(data);
    });
});

```
