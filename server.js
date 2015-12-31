var koa = require('koa');
var koaStatic = require('koa-static');
var koaSend = require('koa-send');
var koaCompress = require('koa-compress');

var app = koa();

const PORT = process.env.PORT || 9999;

app.use( koaCompress() );
app.use( koaStatic('public') );
app.use( koaStatic('compiled') );
app.use( function*(){
  yield koaSend( this, 'public/index.html' );
});

app.listen( PORT );

console.log('Server listening on localhost:' + PORT);
