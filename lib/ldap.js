const config = require('config');
const ldap = require('ldapjs');
const assert = require('assert');

async function auth(userID, password) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsUser(ldapClient, userID, password);
  } catch (err) {
    return false;
  }
  await unbind(ldapClient);
  return true;
}

async function getPubkey(userID) {
  const ldapClient = ldap.createClient(config.ldapOption);
  await bindAsAdmin(ldapClient);
  const pubkey = await new Promise((resolve, reject)=>{
    ldapClient.search(`uid=${userID},ou=People,${config.domain}`, {attributes: 'sshPublicKey'}, (err, res)=>{
      if (err) {
        reject(err);
      } else {
        let complete = false;
        res.on('searchEntry', (entry)=>{
          assert.equal(false, complete);
          complete = true;
          assert.equal(1, entry.attributes.length);
          resolve(entry.attributes[0].vals);
        });
      }
    });
  });
  await unbind(ldapClient);
  return pubkey;
}

async function updatePassword(userID, password, userPassword, sambaNTPassword) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsUser(ldapClient, userID, password);
  } catch (err) {
    return false;
  }
  await unbind(ldapClient);

  await bindAsAdmin(ldapClient);
  await new Promise((resolve, reject)=>{
    ldapClient.modify(`uid=${userID},ou=People,${config.domain}`, [
      new ldap.Change({
        operation: 'replace',
        modification: {
          userPassword,
        },
      }),
      new ldap.Change({
        operation: 'replace',
        modification: {
          sambaNTPassword,
        },
      }),
    ], (err)=>{
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  await unbind(ldapClient);
  return true;
}

module.exports = {
  auth,
  getPubkey,
  updatePassword,
};

function bindAsAdmin(ldapClient) {
  return new Promise((resolve, reject)=>{
    ldapClient.bind(`cn=admin,${config.domain}`, config.adminPassword, (err)=>{
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function bindAsUser(ldapClient, userID, password) {
  return new Promise((resolve, reject)=>{
    ldapClient.bind(`uid=${userID},ou=People,${config.domain}`, password, (err)=>{
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function unbind(ldapClient) {
  return new Promise((resolve, reject)=>{
    // ldapClient.unbind((err)=>{
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve();
    //   }
    // });
    resolve();
  });
}
