var config = require('./dbconfig');
const sql = require('mssql');


async function getFHSs() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("SELECT * from FHS");
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getFHS(orderId) {
    let id = "FHS_id"
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.Int, orderId)
            .query(`SELECT * from FHS where ${id} = @input_parameter`);
        return product.recordsets;

    }
    catch (error) {
        console.log(error);
    }
}

async function getACH() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("SELECT * from ACH");
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getSLEH() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("SELECT * from SLEH");
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}


async function addOrder(fhs) {
    try {
        let id = "FHS_id"
        let pool = await sql.connect(config);
        let insertProduct = await pool.request()
            .input('hospital_list', sql.NVarChar, fhs.hospital_list)
            .query(`INSERT INTO FHS (hospital_list) VALUES ('${fhs.hospital_list}')`);
           // let insertProduct1 = pool.request().input('hospital_list', sql.NVarChar, fhs.hospital_list).query(`SELECT * from FHS where hospital_list = @hospital_list`);
        return insertProduct.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteRecord(fhs) {
    try {
        let pool = await sql.connect(config);
        let deleteRecord = await pool.request()
            .input('input_parameter', sql.Int, fhs.FHS_id)
            .query(`DELETE FROM FHS WHERE FHS_id = @input_parameter`);
        return deleteRecord.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}






module.exports = {
    getFHSs: getFHSs,
    getFHS : getFHS,
    addOrder : addOrder,
    deleteRecord: deleteRecord,
    getACH: getACH,
    getSLEH: getSLEH
}