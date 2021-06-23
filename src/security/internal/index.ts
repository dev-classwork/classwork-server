class InternalSecurity {
    checkIsAuthorized(auth: string) {
        if(auth == process.env.REACT_APP_DB_IDENTITY){
            return true;
        }else{
            return false;
        }
    }
}

export default InternalSecurity;