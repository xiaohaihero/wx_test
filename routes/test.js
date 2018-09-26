// const router = require('koa-router')()

// router.prefix('/wx_test');

// //测试
// router.get('/test', async (ctx, next) => {
//   ctx.body = {
//     ret:0,
//     msg:"success"
//   }
// });


// module.exports = router

for(var i=0; i<10 ;i++){
    setTimeout(function (){
      console.info(i+" a")
    },i*100);
    }

for(let i=0; i<10 ;i++){
  setTimeout(function (){
    console.info(i+" b")
  },i*100);
}
