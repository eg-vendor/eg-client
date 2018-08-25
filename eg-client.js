

(function ( ) {

    var client = {

        form : null
       ,logger : null
       ,results: {
            getUserDetail : null
        }
       ,txns : {
            getUserDetail : {
                txnid : 'egv-eg-client-get-user-detail'
               ,finishFn : 'this.getUserDetailFinish()'
            }
        }

       ,_init : function ( ) {
            // Identify logger
            try {
                this.logger     = document.getElementById('hpapi-logger').getElementsByTagName('textarea')[0];
            }
            catch (e) {
                console.log ('client._init(): hpapi logger form not found - will use browser console');
            }
            // Get some daily data
            this.form = document.getElementById ('eg-client');
            this.form.download.addEventListener ('click',this.getUserDetail.bind(this));
            // Done
            this.log ('client._init(): initialised');
        }

       ,_load : function (evt) {
            evt.preventDefault ();
            var frm                     = evt.target.form;
            if (frm.code.value!=0) {
                this.log ('client._load(): failed to get a return value, error: '+frm.code.value+' '+frm.error.value);
                return;
            }
            try {
                var obj                 = JSON.parse (frm.json.value);
                this.results[obj.txnid] = obj;
            }
            catch (e) {
                this.log ('client._load(): '+e);
            }
            this.log ('client._load(): successfully loaded data');
            for (t in this.txns) {
                if (this.txns[t].txnid==obj.txnid) {
                    eval (this.txns[t].finishFn);
                    return;
                }
            }
        }

       ,_post : function (evt) {
            evt.preventDefault ();
            var frm = document.getElementById (evt.target.form.txnid.value);
                frm.ready.addEventListener ('click',this._load.bind(this));
                this.log ('client._post(): invoking hpapi post');
                frm.post.click();
        }

       ,getUserDetail : function (evt) {
            evt.preventDefault ();
            var frm                     = document.getElementById('hpapi-new');
            frm.txnid.value             = this.txns.getUserDetail.txnid;
            frm.class.value             = '\\Egv\\EgServer';
            frm.method.value            = 'getUserDetail';
            frm.argcount.selectedIndex  = 1;
            frm.arg_1                   = 'foo';
            frm.created.addEventListener('click',this._post.bind(this));
            this.log ('client.getUserDetail(): invoking hpapi client request');
            frm.new.click();
        }

       ,getUserDetailFinish : function (evt) {
            try {
                this.form.results.value = JSON.stringify (this.results[this.txns.getUserDetail.txnid],null,'    ');
                this.log ('client.getUserDetailFinish(): got data object');
            }
            catch (e) {
                this.log ('client.getUserDetailFinish(): failed to get an object - '+e);
            }
            this.form.ready.click ();
        }

       ,log : function (str) {
            if (!this.logger) {
                console.log (str);
                return;
            }
            this.logger.value += str + '\n';
        }

    }

    client._init ();

})();

