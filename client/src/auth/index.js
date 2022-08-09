export const pushError = (fn,prop,msg) => {
    fn(prev => {return{
        ...prev, [prop]: {
            ...prev[prop], errMsg: msg
        }
    }}
    )
}

export const emailChecker = (email) => {
     return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

