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
