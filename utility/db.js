const mysql = require('mysql');
const dbConfig = require('../db_config.js');
class DatabaseUtility{
    constructor(){
        this.connection = mysql.createConnection(
            dbConfig
        );
        this.connection.connect();
        this.admissionLevelMap = {};
        this.ProvincesMap = {};
    }

    static prepare(columns = '*', table = 'users', condition = false){
        var sql = 'SELECT ?? FROM ??';
        if(condition){
            sql = sql + ' WHERE ' + condition;
        }
        
        var inserts = [columns, table];
        sql = mysql.format(sql, inserts);
        return sql;
    };

    query(query_str){
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection.query(query_str, function (err, rows) {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    };
    
    
    dbInsert(tableName, insertObj, cb = null){
        this.connection.query('INSERT INTO ?? SET ?', [ tableName, insertObj ], function (error, results) {
            if (error) throw error;
            cb && cb(results.insertId);
        });
    };

    dbClose(){
        this.connection && this.connection.end();
    };

    
    //extract admission_level into an object    
    getPromiseOfAdmissionLevel()  {
        var strQueryAdmissionLevelSql = DatabaseUtility.prepare(['name', 'id'],'admission_level');
        var findData = this.query(strQueryAdmissionLevelSql);
        return findData;
    }

    handleGetPromiseOfAdmissionLevel(promise){
        var self = this;
        promise.then(function(data){
            for(var i = 0; i < data.length; i++){
                var name = data[i]['name'];
                var id = data[i]['id'];
                self.admissionLevelMap[name] = id;
            }
            console.log(self.admissionLevelMap);
        });
    }
        
    getPromiseOfProvinces()  {
        var strQueryProvincesSql = DatabaseUtility.prepare(['chinese_name', 'id'],'provinces');
        var findData1 = this.query(strQueryProvincesSql);
        return findData1;
    }

    handleGetPromiseOfProvinces(promise){
        var self = this;
        promise.then(function(data){
            for(var i = 0; i < data.length; i++){
                var name = data[i]['chinese_name'];
                var id = data[i]['id'];
                self.ProvincesMap[name] = id;
            }
            console.log(self.ProvincesMap);
        });
    }
    
}

            

module.exports = DatabaseUtility;