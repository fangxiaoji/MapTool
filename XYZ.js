// ----  普通XYZ 切片开始 ----
var xyzLayer= new ol.layer.Tile({
    source : new ol.source.XYZ({
       url : 'http://localhost:8080/baseMap/{z}/{x}/{y}.png'
    })
});
// ----  普通XYZ 切片结束 ----

// ----  天地图XYZ 切片开始 ----
// 这个地址可以在天地图的官网查到，TK=后面需要你在天地图官网上申请一个Token
var tianditu_satellite_tile_url:'http://t1.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=efaf349a35a1321e8ae8d916e876e40a'
var tiandituSatelliteLayer = new ol.layer.Tile({
    title: "天地图卫星影像",
    source: new ol.source.XYZ({
      url:  tianditu_satellite_tile_url,
      reprojectionErrorThreshold:1,
      opaque:true
    }),
    useInterimTilesOnError:false,
    preload:0
});
// ----  天地图XYZ 切片结束 ----

// ----  ArcGIS 切片开始 ----
var arcgisLayer= new ol.layer.Tile({
    source : new ol.source.XYZ({
        tileUrlFunction : function (xyz, obj1, obj2) {
            var z = xyz[0];
            var x = Math.abs(xyz[1]);
            var y = Math.abs(xyz[2]) - 1;
            var x = 'C' + padLeft(8, x.toString(16));
            var y = 'R' + padLeft(8, y.toString(16));
            var z = 'L' + padLeft(2, z);
            var url = 'ArcServerTile/' + z + '/' + y + '/' + x + '.png';
            return url;
        }
    })
 })
 //将10进制转16进制，余位补0，凑成ArcServer的切片格式
function padLeft(num, val) {
    return (new Array(num).join('0') + val).slice(-num);
}
// ----  ArcGIS 切片结束 ---- 

// ----  GeoServer 切片开始 ----
var geoServerLayer= new ol.layer.Tile({
    source : new ol.source.XYZ({
                tileUrlFunction :function (xyz, obj1, obj2) {
            if (!xyz) 
                return "";        
            var z=xyz[0];
            var x=Math.abs(xyz[1]);
            var y=Math.abs(xyz[2]);
            var xyz_convert= convert_(z,x,y);
            x=xyz_convert[0];
            y=xyz_convert[1];
            z=xyz_convert[2];
            var shift = z / 2;
            var half = 2 << shift;
            var digits = 1;
            if (half > 10)
                digits = parseInt(Math.log(half)/Math.log(10)) + 1;
            var halfx = parseInt(x / half);
            var halfy = parseInt(y / half);
            x=parseInt(x);
            y=parseInt(y)+1;
            var url=tileRoot+"/EPSG_900913"+"_"+padLeft_(2,z)+"/"+padLeft_(digits,halfx)+"_"+padLeft_(digits,halfy)+"/"+padLeft_(2*digits,x)+"_"+padLeft_(2*digits,y)+"."+format;
            return url;
        }
    })
});
//字符截取
var padLeft_ = function(num, val) {
  return (new Array(num).join('0') + val).slice(-num);
};
//xy行列转换
var convert_=function(zoomLevel, x, y) {
   var extent = Math.pow(2, zoomLevel);
   if (x < 0 || x > extent - 1) {
       console.log("The X coordinate is not sane: " + x);
       return;
   }
   if (y < 0 || y > extent - 1) {
       console.log("The Y coordinate is not sane: " + y);
       return;
   }
   var gridLoc = [x, extent - y - 1, zoomLevel];
   return gridLoc;
}
 // ----  GeoServer 切片结束 ----