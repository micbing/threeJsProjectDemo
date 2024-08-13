
   function request() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    get:key=>key
                })
            })
        })
    }

class dBase{
    constructor() {
        this.db = null
        this.promiseResolve = null;
        this.promiseFn=null
       this.initRequest()
    }
    initRequest() {
        this.promiseFn = new Promise((resolve) => {
            this.promiseResolve = resolve;
            return  request().then((res) => {
                this.db = res
                this.promiseResolve()
       }) 
        })
    }
    ready() {
      return this.promiseFn  
    }
    getItem() {
        this.ready().then(() => {
           console.log(this.db.get('info2'))
       })
    }
}

export default dBase