require('dotenv').config();
const mysql = require('mysql2');
const Promise = require('bluebird');

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.ADMIN,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
const db = Promise.promisifyAll(connection, { multiArgs: true});

db.connectAsync()
  .then(() => console.log(`Connected to MySQL as id: ${db.threadId}`))
  .catch((err) => console.log(err));


//module.exports ={

getAllProducts = (cb) => {
  const sql = 'select * from SDCI.Products limit 5 ';
  return connection.query(sql, (err, result) => {
    if(err) {
      console.log('getAllProductsDBErr', err)
    } 
    cb(result);
  })
};

 getOneProduct = (productId, cb) => {
     const sql = `select Products.Product_id, Products.Name, Products.Slogan, Products.Description, Products.Category, Products.Default_price, Features.Feature, Features.Value from SDCI.Products inner join SDCI.Features on Products.Product_id = Features.Product_id where Products.Product_id = ${productId}`
     
     var result = {};
     var features = [];
     return connection.query(sql, (err, data) => {
      //console.log(data);
      if(err) console.log(err);
      for(var i = 0; i < data?.length; i++) {
        if(!result['id']||!result['name']||!result['category']||!result['slogan']||!result['description']||!result['default_price']) {
          result['id'] = data[i]['Product_id'];
          result['name'] = data[i]['Name'];
          result['category'] = data[i]['Category'];
          result['description'] = data[i]['Description'];
          result['default_price'] = data[i]['Default_price'] + '.00';
          result['slogan'] = data[i]['Slogan'];
        }
        var feature = {};
        feature['feature'] = data[i]['Feature'];
        feature['value'] = data[i]['Value'];
        features.push(feature);
      }
      result['features'] = features;
      //console.log(result);
      cb(result);
     });

    };

    // getStyles = (productId, cb) => {
    //   var resultPromise = [];
    //     const sql = `select * from SDCI.Styles where Styles.Product_id = ${productId}`;
    //     var dataStyle =  connection.query(sql);
    //     resultPromise.push(dataStyle);
    //     Promise.all(resultPromise)
    //     .then(data => {
    //       for(var i = 0; i < data.length; i++) {
    //         var style = {};
    //           style['style_id'] = data[i]['Id'];
    //           style['default'] = data[i]['Default_style'];
    //           style['name'] = data[i]['Name']
    //           style['original_price'] = data[i]['Original_price'];
    //           result.push(style);
    //           console.log('result', result)
    //       }
    //     })
    //        .then(result => {
    //               cb(result)
    //             })
    //             .catch(err => {
    //               console.log(err);
    //             })
         
    //   }
      
        //  return connection.query(`select Skus.Size, Skus.Quanlity, Skus.Id from SDCI.Skus where Style_id = ${data[i].Id}`, (err, data) => {
        //   if(err) console.log(err);
        //   var dataSkus = {};
        //   for(var i = 0; i < data.length; i++ ) {
        //      if(!dataSkus[data[i]['Id']]) {
        //       dataSkus[data[i]['Id']].quantity = data[i]['Quanlity'];
        //       dataSkus[data[i]['Id']].size = data[i]['Size'];
        //      }
        //   }
        //   result.skus = dataSkus
        //  })

      //   async function getStyles(productId, cb) {
      //    var result = [];
      //    try {
      //     const sql = `select * from SDCI.Styles where Styles.Product_id = ${productId}`;
      //     const data = await connection.query(sql);
      //     for(var i = 0; i < data.length; i++) {
      //               var style = {};
      //                 style['style_id'] = data[i]['Id'];
      //                 style['default'] = data[i]['Default_style'];
      //                 style['name'] = data[i]['Name']
      //                 style['original_price'] = data[i]['Original_price'];
      //                 result.push(style);
      //                 console.log('result', result)
      //             }
      //             cb(result);

      //   }catch (err) {
      //     console.log(err);
      //   }
      
      
      // }

      getStyles = (productId, cb) => {
        //var sql = `select Skus.Size, Skus.Quanlity, Photos.Url, Photos.Thumbnail_url,Skus.Style_id, Styles.Name, Styles.Sale_price, Styles.Original_price, Styles.Default_style from  SDCI.Skus join SDCI.Photos on Photos.Style_id = Skus.Style_id join SDCI.Styles on Skus.Style_id = Styles.Id where Photos.Style_id in (select Styles.Id from Styles where Product_id = ${productId});`
        var result = [];
        var styleSql = `select Styles.Id as 'style_id', Styles.Name as 'name', format(Styles.Sale_price,2) as 'sale_price', 
        format(Styles.Original_price, 2) as 'original_price', (case Styles.Default_style when 1 then 'true' else 'false' end) as 'default?'
         from   SDCI.Styles
         where Styles.Product_id = ${productId}
         group by Styles.Id, Styles.Default_style, Styles.Original_price, Styles.Sale_price;`
         

        connection.query(styleSql, (err, dataSty) => {
          if(err){
            console.log(err);
            return;
          }

        result = dataSty;
        var skuCount = 0;
        var photoCount = 0;
        for(let i = 0; i < result.length; i++) {


        var photoSkuSql = `SELECT Skus.Id,json_object('size',Size,'quantity',Quanlity), json_object('url', Photos.Url, 'thumbnail_url', Photos.Thumbnail_url)
        from SDCI.Skus
        left outer join SDCI.Photos
        on Skus.Style_id = Photos.Style_id
        where Skus.Style_id = ${result[i]['style_id']}
        GROUP BY Id;`

        connection.query(photoSkuSql, (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
          var skuData = {};
          var photoData = [];
          for(let i = 0; i < data.length; i++) {

            

            skuData[data[i]['Id']] = data[i]["json_object('size',Size,'quantity',Quanlity)"];

            photoData.push(data[i]["json_object('url', Photos.Url, 'thumbnail_url', Photos.Thumbnail_url)"]);
          //   result[i]['skus'] = skuData;
          // result[i]['photo'] = photoData;
          }
         result[i]['skus'] = skuData;
         result[i]['photos'] = photoData;
         photoCount++;
         skuCount++;
         if(skuCount == result.length && photoCount == result.length) {
          cb(result);
         }

        })
          // var skusSql = `SELECT json_objectagg(Id,JSON_OBJECT('size',Size,'quantity',Quanlity))
          // FROM SDCI.Skus
          // where Skus.Style_id = ${result[i]['style_id']}
          // GROUP BY Id;`
          //    connection.query(skusSql, (err, data) => {
          //     if(err){
          //       console.log(err);
          //       return;
          //     }
          //       var skusData = {};
          //       for(let i = 0; i < data.length; data++) {
          //         console.log('values', Object.values(data[i]));
          //        }
                
          //       result[i]['skus'] = data;
          //       //console.log('result', result[i]);
          //       //result[i]['skus'] = objOfSku;
          //       skuCount++;
          //       if(skuCount == result.length && photoCount == result.length) {
          //         cb(result);
          //       }
          //     })
          //     var photoSql = `SELECT json_objectagg(Id,JSON_OBJECT('size',Size,'quantity',Quanlity))
          // FROM SDCI.Skus
          // where Skus.Style_id = ${result[i]['style_id']}
          // GROUP BY Id;`
          //    connection.query(photoSql , (err, data) => {
          //     if(err){
          //       console.log(err);
          //       return;
          //     }

          //       result[i]['photo'] = data;
          //      // console.log('result', result[i]);
          //       //result[i]['skus'] = objOfSku;
          //       photoCount++;
          //       if(skuCount == result.length && photoCount == result.length) {
          //         cb(result);
          //       }
          //     })

              
         };
        
         
          //console.log('result//',result );
             
                
     });
   

    };
  

  module.exports ={getAllProducts, getOneProduct, getStyles};

