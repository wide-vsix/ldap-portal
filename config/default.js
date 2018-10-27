module.exports = {
  ldapOption: {
    url: 'ldaps://ldap.hirano.work',
  },
  domain: 'dc=hirano,dc=work',
  secret: process.env.SECRET,
  adminPassword: process.env.PASSWORD,
};
