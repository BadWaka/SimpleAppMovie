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
