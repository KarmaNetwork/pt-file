import P2P from './connection.js'

/*

let state = {}

state.promises = {};

state.promises.recv_data = {};

state.promises.recv_data.promise = new Promise( ( resolve, reject ) => {
  state.promises.recv_data.resolve = resolve;
  state.promises.recv_data.reject = reject;
} );

state.promises.on_open.promise = new Promise( ( resolve, reject ) => {
  state.promises.on_open.resolve = resolve;
  state.promises.on_open.reject = reject;
} );

state.ws = new WebSocket('ws://localhost:3000/bootstrap');

state.ws.onopen(() => {
  state.p2p = new P2P({
    handlers: {
      send_bootstrap(pk, data) {
    let s = {
      from: state.p2p.get_hex_key().publicKey,
      to: pk,
      data:data,
    }
    state.ws.send(JSON.stringify(s));
      },
      recv_data(pk, data) {
    state.promises.recv_data.resolve({
      pk: pk,
      data: data,
    })
      }
    }
  });
  console.log(`public key is ${state.p2p.get_hex_key().publicKey}`);
  state.promises.on_open.resolve();
});

state.ws.onmessage = (data) => {
  let m = JSON.parse(data);
  if (m.op == 'signal') {
    console.log(`recv signal from ${m.from}`);
    state.p2p.recv_bootstrap(m.from, m.data );
  }
}

*/

export default class FileTransfer {
    constructor( prefix, sender ) {
        this.prefix = prefix;

        this.ws = new WebSocket('ws://127.0.0.1:3000/bootstrap');
        this.first = false;
        this.p2p = new P2P( {
            handlers: {
                recv_bootstrap: (pk, data) => {
                    this.ws.send( {
                        from: this.p2p.get_hex_key().publicKey,
                        to: pk,
                        data: data,
                        op: 'signal',
                    } )
                },
                connected: (pk) => {
                    if (! sender) {
                        let file_info = {
                            op:'meta',
                        }
                        this.first = true;
                        this.p2p.send(JSON.stringify(file_info));
                    }
                },
                recv_data: (pk, data) => {
                    console.log(`receive data from ${pk}`);
                    if ( sender ) {
                        let m = JSON.parse();
                        if (m.op === 'meta') {
                            let file_info = {
                                name: this.files.name,
                                size: this.files.size,
                                type: this.files.type,
                            }
                            this.p2p.send(JSON.stringify(file_info));
                        } else if (m.op === 'query') {
                            this.onprocess(m.begin, this.files.size);
                            let segment = this.files.slice(m.begin, m.end);
                            let reader = new FileReader();
                            reader.onload( (e) => {
                                this.p2p.send(e.target.result);
                                this.onprocess(m.end, this.files.size);
                            } );
                            reader.readAsArrayBuffer(segment);
                        }
                    } else {
                        if (this.first) {
                            let m = JSON.parse(data);
                            this.file_info = m;
                        } else {

                        }
                        if (this.first >= this.file_info.size) {
                            let query = {
                                op: 'query',
                                begin: this.first === true ? 0 : this.first,
                                end: this.file_info.size,
                            }
                            this.p2p.send(JSON.stringify(query));
                        }
                    }
                }
            }
        });

        this.ws.onmessage = (data) => {
            let m = JSON.parse(data);
            if (m.op === 'signal') {
                console.log(`recv signal from ${m.from}`);
                this.p2p.recv_bootstrap(m.from, m.data );
            }
        }
    }

    getUrl(files) {
        this.files = files;
        return this.prefix + '/' + this.p2p.get_hex_key().publicKey;
    }
}

