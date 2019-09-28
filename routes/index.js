const express = require('express');
const router = express();

module.exports = (logger)=>{
  router.use((req, res, next)=>{
    res.render('index');
  });

  router.use((err, req, res, next)=>{
    const message = err.message;
    const status = err.status==null ? 500 : err.status;
    const stack = req.app.get('env') === 'development' ? err.stack : null;

    res.status(status);
    res.render('error', {status, message, stack});

    if (status == 500) {
      logger.error(err.stack);
    }
  });

  return router;
};
