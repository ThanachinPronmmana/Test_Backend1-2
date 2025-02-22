const Star = (x)=>{
    for(let i = 1 ;i<=x;i++){
        console.log("*".repeat(i))
    }
    for(let i = x-1 ; i>=1;i--){
        console.log("*".repeat(i))
    }
}
Star(5)