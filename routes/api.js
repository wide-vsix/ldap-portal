const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const shellescape = require('shell-escape');
const {exec} = require('child_process');
const router = express();
const lib = require('../lib');
const {nthash} = require('smbhash');

module.exports = (logger)=>{
  router.post('/auth', async (req, res, next)=>{
    try {
      const {userID, password} = req.body;
      const authed = await lib.ldap.auth(userID, password);
      if (authed) {
        const token = jwt.sign({userID}, config.secret);
        res.json({ok: true, token});
      } else {
        const err = new Error('invalid userID or password');
        err.status = 403;
        next(err);
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/pubkey', authed, async (req, res, next)=>{
    try {
      const pubkey = await lib.ldap.getPubkey(req.userID);
      res.json({ok: true, pubkey});
    } catch (err) {
      next(err);
    }
  });

  router.post('/pubkey', authed, async (req, res, next)=>{
    const {pubkey} = req.body;
  });

  router.delete('/pubkey', authed, async (req, res, next)=>{
    const {index} = req.body;
  });

  router.post('/password', authed, async (req, res, next)=>{
    const {password, newPassword} = req.body;
    if (typeof newPassword != 'string' || newPassword.length < 8) {
      const err = new Error('invalid new password');
      err.status = 400;
      return next(err);
    }
    try {
      const userPassword = await new Promise((resolve, reject)=>{
        exec(shellescape(['/usr/sbin/slappasswd', '-c', '$6$%.8s', '-s', newPassword]), (err, stdout, stderr)=>{
          if (err) {
            reject(err);
          } else {
            resolve(stdout.trim());
          }
        });
      });
      const sambaNTPassword = nthash(newPassword);
      const result = await lib.ldap.updatePassword(req.userID, password, userPassword, sambaNTPassword);
      if (!result) {
        const err = new Error('invalid old password');
        err.status = 400;
        return next(err);
      }
      res.json({ok: true});
    } catch (err) {
      next(err);
    }
  });

  router.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  router.use((err, req, res, next) => {
    const message = err.message;
    let status = err.status==null ? 500 : err.status;

    res.status(status);
    res.json({ok: false, message, status});

    if (status == 500) {
      logger.error(err.stack);
    }
  });

  return router;
};

function authed(req, res, next) {
  const token = req.body.token || req.query.token;
  if (token == null) {
    const err = new Error('Unauthorized');
    err.status = 403;
    return next(err);
  }
  try {
    const {userID} = jwt.verify(token, config.secret);
    req.userID = userID;
    return next();
  } catch (_) {
    const err = new Error('Invalid token');
    err.status = 400;
    return next(err);
  }
}
