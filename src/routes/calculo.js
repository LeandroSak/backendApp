const calculo = function(){
    let numero = JSON.parse(process.argv[2])
    let sum=0;
    for(let i =0 ;i < numero; i++){
        sum +=1
    }
    return sum
}

const calculo2=function(){
    let numero = JSON.parse(process.argv[2])
    let sum=new Object();
    for(let i =0 ;i < numero; i++){
        let x = Math.ceil(Math.random()*1000);
       
        if(sum.hasOwnProperty(`${x}`)){
            sum[`${x}`]+=1
        }else{
           sum={
            ...sum,
            [`${x}`]:1
           }
        }
    }
    return sum
}

process.on("message",function(msg){
    if(msg==="start"){
        let sum = calculo2();
        process.send(sum)
    }
})

