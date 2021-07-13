const config = {
    user :'kashi',
    password :'Kashi29A',
    server:'127.0.0.1\\MSSQLSERVER',
    database:'inventory',
    options:{
        trustedconnection: true,
        enableArithAbort : true,
        trustServerCertificate: true,
        instancename :'MSSQLSERVER'
    },
    port : 1433
}

module.exports = config; 