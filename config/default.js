module.exports = {
  ldapOption: {
    url: 'ldap://ldap.hirano.work',
  },
  domain: 'dc=hirano,dc=work',
  secret: process.env.SECRET,
  adminPassword: process.env.PASSWORD,
};
