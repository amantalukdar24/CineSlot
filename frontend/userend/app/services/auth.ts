const AuthUser=():boolean=>{
    if(localStorage.getItem("token")) return true;
    return false;
}

export {AuthUser}