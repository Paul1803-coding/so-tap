// Dữ liệu giả lập khoảng 3 tuần dùng thật (12 buổi tập, ăn mỗi ngày, cân, vòng bụng) để chạy thử. Ngày "hôm nay" của bộ thử là 26/10/2026.
var P={UA:[["ua1","smbench",60,7,"C"],["ua2","brow",55,9,"C"],["ua3","incdb",22,10,"C"],["ua4","latpd",55,11,"C"],["ua5","tripd",25,12,"I"],["ua6","dbcurl",12,12,"I"],["ua7","latraise",8,14,"I"]],
LA:[["la1","squat",70,7,"C"],["la2","rdl",70,9,"C"],["la3","legext",45,12,"I"],["la4","legcurl",35,12,"I"],["la5","calfst",60,14,"I"],["la6","crunch",30,14,"I"]],
UB:[["ub1","smohp",35,8,"C"],["ub2","pullup",50,9,"C"],["ub3","dbbench",24,10,"C"],["ub4","cablerow",50,11,"C"],["ub5","latcable",5,14,"I"],["ub6","inccurl",10,12,"I"],["ub7","ohtri",20,12,"I"],["ub8","pecdeck",40,13,"I"]],
LB:[["lb1","dl",90,5,"C"],["lb2","hack",80,10,"C"],["lb3","legcurl",35,11,"I"],["lb4","legext",45,13,"I"]]};
function key(d){return d.toISOString().slice(0,10)}
var S={v:3,profile:{sex:"m",age:28,height:171,weight:80.6,act:1.5,rate:-0.25,pkg:1.75,weekly:4,goalBf:12,tdee0:2600,start:"2026-10-05"},
plan:{kcal:2150,p:140,tdee:2580,date:"2026-10-19"},checkins:[{date:"2026-10-12",tdee:2600,kcal:2180,p:140},{date:"2026-10-19",tdee:2580,kcal:2150,p:140}],
swaps:{},equip:{seatcurl:false},equipSet:true,workouts:[],draft:null,food:{},weight:{},waist:{},neck:{},hip:{},custom:[],lastBackup:null};
var sched={1:"UA",2:"LA",4:"UB",6:"LB"}, n=0, meals=[
 [["Xôi, thịt lợn quay, chút rau",620,24,82,20],["Cơm căng tin: cơm, thịt kho, rau muống",720,32,90,22],["Ức gà xào sả ớt (cơm 150g)",600,58,55,14],["Sữa chua Hy Lạp",60,10,4,0]],
 [["Bánh mì thịt",414,18,49,15],["Cơm, cá rán, canh rau",650,30,85,18],["Bò xào bông cải (cơm 150g)",640,45,60,20],["Chuối",105,1,27,0]],
 [["Phở bò",455,26,55,13],["Cơm, gà rang, đậu phụ sốt",700,38,80,22],["Cá hồi áp chảo, rau luộc",520,34,30,26],["Whey 1 muỗng",120,24,3,1]]];
for(var i=0;i<22;i++){var d=new Date(Date.UTC(2026,9,5+i)),k=key(d),wd=d.getUTCDay();
 var w=80.6-i*0.035+Math.sin(i*1.7)*0.35; S.weight[k]=Math.round(w*10)/10;
 if(wd===1){S.waist[k]=92-i*0.06;S.neck[k]=39;}
 if(i<21){var m=meals[i%3];S.food[k]=m.map(function(x,j){var ts=Date.UTC(2026,9,5+i,[0,5,12,14][j]);return{id:k+j,n:x[0],kcal:x[1],p:x[2],c:x[3],f:x[4],base:{kcal:x[1],p:x[2],c:x[3],f:x[4]},mul:1,ts:ts,rid:null}});}
 if(sched[wd]&&i<21){var wk=Math.floor(i/7);S.workouts.unshift({id:"w"+i,date:k,ts:Date.UTC(2026,9,5+i,13),key:sched[wd],dur:62*60000,ex:P[sched[wd]].map(function(e){var kg=e[2]+wk*(e[4]=="C"?2.5:1);return{id:e[1],slot:e[0],sets:[0,1,2].map(function(s){return{kg:kg,reps:e[3]-(s==2?1:0)+(wk==2&&e[0]=="ua1"?-1:0),rir:s==2?1:2}}),fb:"ok"}})});}
}
S.food["2026-10-26"]=[{id:"t1",n:"Xôi, thịt lợn quay, chút rau",kcal:571,p:21.5,c:85,f:15,base:{kcal:571,p:21.5,c:85,f:15},mul:1,ts:Date.UTC(2026,9,26,0,30),rid:null,parts:[{id:"xoi",g:200},{id:"heo_quay",g:60},{id:"rau_luoc",g:125}]}];
S.weight["2026-10-26"]=79.6;
module.exports=S;
if(require.main===module)console.log(JSON.stringify(S).length);
