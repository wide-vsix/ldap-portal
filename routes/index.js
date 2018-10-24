const express = require('express');
const router = express();

router.use((req, res, next)=>{
  res.render('index');
});

router.use((err, req, res, next)=>{
  const message = err.message;
  let status = err.status==null ? 500 : err.status;
  const stack = req.app.get('env') === 'development' ? err.stack : null;

  res.status(status);
  res.render('error', {status, message, stack});
});


module.exports = router;
